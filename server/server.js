require("dotenv").config(); // Load .env variables
// Import and initialize Express listening on configured or port 5000
const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.SERVER_PORT;
const { decrypt, encrypt } = require("./helpers/de_encrypt.js");

// Use JSON Parser & URLEncoding in Express so we can grab `req.body` JSON data
app.use(express.json()); // Grab req.body JSON data
app.use(express.urlencoded({ extended: false })); // Grab req.body Form Data

// Use the "root.js" main router file to send all HTTP requests there
app.use("/", require("./routes/root.js"));

// FINALLY BEFORE STARTING SERVER: Catch all invalid CRUDs!
// A "catch-all" during invalid REST API requests being made.
app.all("*", (req, res) => {
  return res.status(400).json({ error: `Ogiltigt REST API-anrop!` });
});

// SERVER START!
// Start server listening for incoming requests on port 3000
app.listen(port, () => {
  console.log(`SÄKER REST API-SERVER STARTAD. PORT: ${port}`);
});
