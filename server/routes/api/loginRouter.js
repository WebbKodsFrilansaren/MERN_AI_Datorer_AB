require("dotenv").config();
// This imports Express and uses the in-built router object in Express
const express = require("express");
const router = express.Router();
const path = require("path");
const login = require("../../controllers/loginController.js");

// Endpoint: POST /api/login
router.post("/", login);

// CATCH ALL in /api/login route!
router.all("*", (req, res) => {
  if (req.headers.accept.includes("html")) {
    return res.sendFile(path.join(__dirname, "../../images", "easteregg.jpg"));
  }
  return res.status(400).json({ error: `Ogiltigt REST API-anrop! <login.js>` });
});

// Export for use!
module.exports = router;
