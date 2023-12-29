require("dotenv").config();
// Secret keys to first validate Refresh Token & Generate new Access Token
const refreshKey = process.env.REFRESH_TOKEN;
const tokenKey = process.env.ACCESS_TOKEN;
const jwt = require("jsonwebtoken");

// /api/refreshatoken = refreshes access_token by providing httpOnly secured jwt cookie! (refresh_token)
const refreshAToken = async (req, res) => {
  // If jwt cookie found
  if (req.cookies.jwt && req.cookies.jwt !== "") {
    // Store cookie
    const refreshToken = req.cookies.jwt;
    // Then JWT.verify it first
    try {
      const decoded = jwt.verify(refreshToken, refreshKey);
      const user = decoded.username;
      // Also validate correct issuer
      if (decoded.iss !== "AI Datorer AB") {
        return res.status(403).json({ error: "Åtkomst nekad" });
      }

      // Initialize MongoDB
      let client;
      // Remove both refresh_token and access_token for `user`
      try {
        // Then grab maka2207 database and its collection "users"
        client = req.dbClient;
        const dbColUsers = req.dbCol;
        await client.connect();

        // Try finding user first if they logged out just after sysadmin changed their username!
        const correctUser = await dbColUsers.findOne({ username: user });
        if (!correctUser) {
          return res.status(403).json({ error: "Åtkomst nekad" });
        }

        // If correct user found, check if their current refresh token is correct one in DB!
        if (correctUser.refresh_token !== refreshToken) {
          return res.status(403).json({ error: "Åtkomst nekad" });
        }

        // Then create new Access Token and sign it using "tokenKey"
        const accessToken = jwt.sign(
          {
            iss: "AI Datorer AB",
            username: correctUser.username,
          },
          tokenKey,
          {
            expiresIn: "90s",
          }
        );

        // Then also update in database that the correct user have new access_token
        const updateRefreshedATokenUser = await dbColUsers.updateOne(
          {
            username: correctUser.username,
          },
          {
            $set: {
              access_token: accessToken,
            },
          }
        );

        // If successful modifiedCount should be 1
        if (updateRefreshedATokenUser.modifiedCount > 0) {
          // Then close MongoDB & send back new access_token
          client.close();
          return res.status(200).json({
            success: "Åtkomstförnyelse lyckades!",
            accessToken: accessToken,
          });
        }
      } catch (err) {
        // When failing to update access_token for `user`
        client.close();
        return res.status(500).json({
          error: "Åtkomstförnyelse misslyckades!",
        });
      }
    } catch (err) {
      // When failing to verify refresh_token
      return res.status(500).json({
        error: "Åtkomstförnyelse misslyckades!",
      });
    }
  } // If jwtcookie not found!
  else {
    return res.status(403).json({ error: "Åtkomstförnyelse misslyckades!" });
  }
};

module.exports = { refreshAToken };
