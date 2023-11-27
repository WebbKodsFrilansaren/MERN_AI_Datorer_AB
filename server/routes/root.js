require("dotenv").config();
// This imports Express and uses the in-built router object in Express
const express = require("express");
const router = express.Router();

// Now we need MongoClient from mongodb npm package and...
const { MongoClient } = require("mongodb");
const dbURL = process.env.MONGO_URL;
//"mongodb://localhost:27017"; // ... its connection...

// For File Management being done in NodeJS (for handling images)
const fs = require("fs");
const path = require("path");

// This is the LAST one because if we have it before others it will be ran and stop the rest of the script!
// This is the "catch-all" responses for CRUD when someone is requesting something that does not exist.
router.get("/*", (req, res) => {
  return res.status(400).json({ error: `Ogiltigt REST API-anrop!` });
});
router.put("/*", (req, res) => {
  return res.status(400).json({ error: `Ogiltigt REST API-anrop!` });
});
router.post("/*", (req, res) => {
  return res.status(400).json({ error: `Ogiltigt REST API-anrop!` });
});
router.patch("/*", (req, res) => {
  return res.status(400).json({ error: `Ogiltigt REST API-anrop!` });
});
router.delete("/*", (req, res) => {
  return res.status(400).json({ error: `Ogiltigt REST API-anrop!` });
});

// Export it so it can be used by `app.js` in root folder.
module.exports = router;
