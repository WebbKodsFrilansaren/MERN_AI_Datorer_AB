require("dotenv").config(); // Load .env variables
// Import and initialize Express listening on configured or port 5001
const express = require("express");
const app = express();
const port = process.env.BFF_PORT;
// Import decrypt & encrypt tools
const { decrypt, encrypt } = require("./helpers/de_encrypt.js");

// Use JSON Parser in Express so we can grab `req.body` JSON data
app.use(express.json());

// FINALLY BEFORE STARTING SERVER: Catch all invalid CRUDs!
// A "catch-all" during invalid REST API requests being made.
app.all("*", (req, res) => {
  return res.status(400).json({ error: `Ogiltigt REST API-anrop!` });
});

// SERVER START!
// Start server listening for incoming requests on port 3000
app.listen(port, () => {
  console.log(`BFF-SERVER STARTAD. PORT: ${port}`);
});
