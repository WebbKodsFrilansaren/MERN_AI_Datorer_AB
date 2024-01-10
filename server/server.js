require("dotenv").config(); // Load .env variables
// Import and initialize Express listening on configured or port 5000
const express = require("express");
const cors = require("cors");
const app = express();
const path = require("path");
const cookieParser = require("cookie-parser");
const port = process.env.SERVER_PORT;
const { corsOptions } = require("../config/corsOPTIONS.js"); // CORS Options are stored here!

// Use JSON Parser & URLEncoding in Express so we can grab `req.body` JSON data
app.use(express.json()); // Grab req.body JSON data
app.use(express.urlencoded({ extended: false })); // Grab req.body Form Data

// Apply CORS using "corsOptions" which only allow HTTP requests from origin:localhost:3000 (ReactJS SPA)
app.use(cors(corsOptions));

// Initialize cookieParser!
app.use(cookieParser());

// Default place for images
app.use("/images", express.static(path.join(__dirname, "images")));

// Use the "root.js" main router file to send all HTTP requests beginning with "/api/" there
app.use("/api", require("./routes/root.js"));

// FINALLY BEFORE STARTING SERVER: Catch all REST API that didn't start with "/api/"
// A "catch-all" during invalid REST API requests being made.
app.all("*", (req, res) => {
  if (req.headers.accept.includes("html")) {
    return res.sendFile(path.join(__dirname, "images", "easteregg.jpg"));
  }
  return res
    .status(400)
    .json({ error: `Ogiltigt REST API-anrop! <server.js>` });
});

// SERVER START!
// Start server listening for incoming requests on port 5000
app.listen(port, () => {
  console.log(`SÄKER REST API-SERVER STARTAD. PORT: ${port}`);
});
