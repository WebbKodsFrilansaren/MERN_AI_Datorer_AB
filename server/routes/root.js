require("dotenv").config();
// This imports Express and uses the in-built router object in Express
const express = require("express");
const router = express.Router();
const path = require("path");
const crypto = require("crypto");
// Now we need MongoClient from mongodb npm package and...
const { MongoClient } = require("mongodb");
const dbURL = process.env.MONGO_URL;
// ...Helpers to decrypt & encrypt JWTs
const { decrypt, encrypt } = require("../helpers/de_encrypt.js");



//router.use(validateJWT);

// Different /api/{sub-routes} | NO SECURITY DEMANDED: No JWT needed!
router.use("/login", require("./api/login.js"));
router.use("/register", require("./api/register.js"));
router.use("/logout", require("./api/logout.js"));

// Different /api/{sub-routes} | SECURITY DEMANDED: MUST CHECK JWT FIRST!
router.use("/blacklists", require("./api/blacklists.js"));
router.use("/pccomponents", require("./api/pccomponents.js"));
router.use("/users", require("./api/users.js"));

// This is the LAST one because if we have it before others it will be ran and stop the rest of the script!
// This is the "catch-all" responses for CRUD when someone is requesting something that does not exist.
router.all("*", (req, res) => {
  if (req.headers.accept.includes("html")) {
    return res.sendFile(path.join(__dirname, "../images", "easteregg.jpg"));
  }
  return res.status(400).json({ error: `Ogiltigt REST API-anrop! <root.js>` });
});

// Export it so it can be used by `app.js` in root folder.
module.exports = router;
