require("dotenv").config();
const bcrypt = require("bcrypt"); // ...bcrypt to check stored password
const jwt = require("jsonwebtoken"); // ...and JSON Web Token to sign a newly created JWT!

// Async loginController function that is used by "POST api/login"
const loginPOST = async (req, res) => {
  console.log(req.body.username);
  console.log(req.body);
  // First check if username & password are provided
  if (!req.body.username || !req.body.password) {
    return res
      .status(403)
      .json({ error: "Användarnamn och/eller lösenord saknas!" });
  }
  // Then store username+password to compare against
  const user = req.body.username;
  const pw = req.body.password;

  // Then initiate MongoDB connection
  let client;
  try {
    // Then grab maka2207 database and its collection "users"
    client = req.dbClient;
    const dbColUsers = req.dbCol;
    await client.connect();

    // Look up `username` to match it exactly | returns null if not found
    const correctUser = await dbColUsers.findOne({ username: user });

    // If we don't find it, we assume wrong username or password and stop request right here
    if (!correctUser) {
      return res
        .status(403)
        .json({ error: "Användarnamn och/eller lösenord är fel!" });
    }

    // If we are here, username does exist so now we compare against password!
    const storedPw = correctUser.userpassword;
    bcrypt.compare(pw, storedPw, async (err, result) => {
      // Internal error but we still say it is not because of it for security reasons
      if (err) {
        client.close();
        return res.status(403).json({
          error: "Användarnamn och/eller lösenord är fel!",
        });
      }
      // Correct password after check!
      if (result) {
        // Now create JWT Token and sign it using ACCESS_TOKEN
        const accessToken = jwt.sign(
          {
            iss: "AI Datorer AB",
            username: correctUser.username,
          },
          process.env.ACCESS_TOKEN,
          {
            expiresIn: "30s",
          }
        );
        // Now create JWT Token and sign it using REFRESH_TOKEN
        const refreshToken = jwt.sign(
          {
            iss: "AI Datorer AB",
            username: correctUser.username,
          },
          process.env.REFRESH_TOKEN,
          {
            expiresIn: "1d",
          }
        );
        console.log("ACCESS TOKEN & REFRESH TOKEN ISSUED!");
        // Encrypt the JWT which will also have a Buffer<> that will be stored in MongoDB!

        // Insert new access & refresh token for successfully logged in user!
        const updateLoggedInUser = await dbColUsers.updateOne(
          {
            username: correctUser.username,
          },
          {
            $set: {
              access_token: accessToken,
              refresh_token: refreshToken,
              last_login: new Date(),
            },
          }
        );

        // If modifiedCount > 0 then we successfully stored the encrypted access token!
        if (updateLoggedInUser.modifiedCount > 0) {
          // So, let's now FINALLY send it back to the user
          client.close();

          // Send refresh token in httpOnly cookie
          // and send short-lived access tooken in JSON that will be stored in JS memory for client!
          res.cookie("refresh_token", refreshToken, { httpOnly: true });
          return res.status(200).json({
            success: "Inloggad. Välkommen in!",
            accessToken: accessToken,
          });
        }
        client.close();
        return res
          .status(403)
          .json({ error: "Något gick fel vid inloggning. Prova igen!" });
      } // Wrong password after check!
      else {
        client.close();
        return res
          .status(403)
          .json({ error: "Användarnamn och/eller lösenord är fel!" });
      }
    });
  } catch (e) {
    // Catch and return 500 Internal Error if it happens!
    client.close();
    return res.status(500).json({
      message: "Fel inträffat på serversidan!",
    });
  }
};
// Export Controller for use!
module.exports = loginPOST;
