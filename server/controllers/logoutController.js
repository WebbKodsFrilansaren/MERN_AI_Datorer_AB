require("dotenv").config();
// Now we need MongoClient from mongodb npm package and...
const { MongoClient } = require("mongodb");
const dbURL = process.env.MONGO_URL;
const refreshKey = process.env.REFRESH_TOKEN;

// jwt=JWT verifying
const jwt = require("jsonwebtoken"); // ...and JSON Web Token to sign a newly created JWT!

// logoutController function to logout, used by "POST api/logout"
const logoutPOST = async (req, res) => {
  // If refresh_token cookie found
  if (req.cookies.refresh_token && req.cookies.refresh_token != "") {
    // Store cookie
    const refreshToken = req.cookies.refresh_token;
    // Then JWT.verify it first
    try {
      const decoded = jwt.verify(refreshToken, refreshKey);
      const user = decoded.username;
      // Initialize MongoDB
      let client;
      // Remove both refresh_token and access_token for `user`
      try {
        client = new MongoClient(dbURL);
        await client.connect();

        // Select `users` collection from database maka2207
        const dbColUsers = client
          .db(process.env.MONGO_DB)
          .collection(process.env.MONGO_DB_COL_USERS);

        // Try finding user first if they logged out just after sysadmin changed their username!
        const findUser = await dbColUsers.findOne({ username: user });
        if (!findUser) {
          return res.status(403).json({ error: "Utloggningen misslyckades!" });
        }

        // Then Update `user` by deleting access & refresh tokens!
        const deleteTokens = await dbColUsers.updateOne(
          { username: user },
          {
            $set: { access_token: "", refresh_token: "" },
          }
        );

        // If successful modifiedCount should be 1
        if (deleteTokens.modifiedCount > 0) {
          // Then close MongoDB, send back empty refresh_token cookie
          client.close();
          // Cookie is not only empty but also expires immediately upon receiving it
          res.cookie("refresh_token", "", {
            expires: new Date(0),
            httpOnly: true,
          });
          return res.status(200).json({ success: "Utloggad!" });
        }
      } catch (err) {
        // When failing to delete tokens for `user`
        client.close();
        return res.status(500).json({ error: "Utloggningen misslyckades!" });
      }
    } catch (err) {
      // When failing to verify JWT
      return res.status(500).json({ error: "Utloggningen misslyckades!" });
    }
  } // If refresh_token cookie not found!
  else {
    return res.status(403).json({ error: "Utloggningen misslyckades!" });
  }
};

// Export for use!
module.exports = logoutPOST;
