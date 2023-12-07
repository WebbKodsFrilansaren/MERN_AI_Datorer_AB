require("dotenv").config();
// This imports Express and uses the in-built router object in Express
const express = require("express");
const router = express.Router();
const path = require("path");
// Now we need MongoClient from mongodb npm package and...
const { MongoClient } = require("mongodb");
const dbURL = process.env.MONGO_URL;

router.get("/", async (req, res) => {
  return res.status(200).json({ success: "Register!" });
});

// CATCH ALL in /api/register route!
router.all("*", (req, res) => {
  if (req.headers.accept.includes("html")) {
    return res.sendFile(path.join(__dirname, "../../images", "easteregg.jpg"));
  }
  return res
    .status(400)
    .json({ error: `Ogiltigt REST API-anrop! <register.js>` });
});

// Export for use!
module.exports = router;
