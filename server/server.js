// Import and initialize Express listening on configured or port 5000
require("dotenv").config({ path: "../.env" }); // Load .env variables
const express = require("express");
const app = express();
const port = process.env.SERVER_PORT;

const { decrypt, encrypt } = require("./helpers/de_encrypt.js");
const test = encrypt("testar");

console.log(decrypt(test[0], test[1]));

//console.log(decrypt("9ea3a1f54128b8a1f4ff2bb698c4ab7a"));

// Use JSON Parser in Express so we can grab `req.body` JSON data
app.use(express.json());

//

// FINALLY BEFORE STARTING SERVER: Catch all invalid CRUDs!
// A "catch-all" during invalid REST API requests being made.
app.all("*", (req, res) => {
  return res.status(400).json({ error: `Ogiltigt REST API-anrop!` });
});

// SERVER START!
// Start server listening for incoming requests on port 3000
app.listen(port, () => {
  console.log(`NodeJS-server startad. Lyssnar på API CRUD på port: ${port}`);
});
