require("dotenv").config();
// Now we need MongoClient from mongodb npm package and...
const { MongoClient } = require("mongodb");
const dbURL = process.env.MONGO_URL;

// Secret Access Token Key
const tokenKey = process.env.ACCESS_TOKEN;

// jwt=JWT management
const jwt = require("jsonwebtoken");

// Validate Access Token! (used as a Middleware)
const validateAccessToken = async (req, res, next) => {
  // Check if access_token exists (stored in authorization)
  if (!req.headers.authorization && !req.headers.Authorization) {
    return res.status(403).json({ error: "Åtkomst nekad!" });
  }
  // Check if authorization header begins with "Bearer "
  if (
    !req.headers.authorization.includes("Bearer ") &&
    !req.headers.Authorization.includes("Bearer ")
  ) {
    return res.status(403).json({ error: "Åtkomst nekad!" });
  }
  // Store access token and try decoding it
  const aToken =
    req.headers.authorization.split("Bearer ")[1] ||
    req.headers.Authorization.split("Bearer ")[1];
  try {
    // IMPORTANT: jwt.verify will FAIL if access token has expired despite being otherwise correct!
    const decoded = jwt.verify(aToken, tokenKey);

    // Also validate correct issuer
    if (decoded.iss !== "AI Datorer AB") {
      return res.status(403).json({ error: "Åtkomst nekad" });
    }

    // If we succeed then we pass on the `req` object!
    let client;
    try {
      // Connect DB, select `maka2207` database + `users` collection
      client = new MongoClient(dbURL);
      await client.connect();
      const dbColUsers = client
        .db(process.env.MONGO_DB)
        .collection(process.env.MONGO_DB_COL_USERS);
      const findUser = await dbColUsers.findOne({ username: decoded.username });

      // Find user stored in JWT Access_token and then compare if same in database for that user!
      if (!findUser) {
        return res.status(403).json({ error: "Åtkomst nekad!" });
      }
      if (findUser.access_token === aToken) {
        console.log("ACCESS TOKEN FORTFARANDE GILTIG! SKICKAR VIDARE!");
        next();
      } else {
        console.log("ACCESS TOKEN LÖPT UT!");
        return res.status(403).json({ error: "Åtkomst nekad!" });
      }
    } catch (e) {
      return res.status(500).json({ error: "Åtkomst nekad!" });
    }
  } catch (e) {
    // Invalid or expired access token
    return res.status(500).json({ error: "Åtkomst nekad!" });
  }
};
// Export for use!
module.exports = validateAccessToken;
