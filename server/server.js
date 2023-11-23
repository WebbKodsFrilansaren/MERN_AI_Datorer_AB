// Import and initialize Express listening on configured or port 5000
const express = require("express");
const app = express();
const port = 5000;
// Also import router file
const apiRouter = require("./routes/api");
// Use the "public" folder for web browser pages
app.use(express.static("public"));

// Use JSON Parser in Express so we can grab `req.body` JSON data
app.use(express.json());

// MongoDB client is being used by the API router so no need here.
// Redirect all incoming /api/ CRUD requsts to the API router
app.use("/api", apiRouter);

// FINALLY BEFORE STARTING SERVER: Catch all invalid CRUDs!
// A "catch-all" during invalid REST API requests being made.
app.get("/*", (req, res) => {
  return res.status(400).json({ error: `Ogiltigt REST API-anrop!` });
});
app.post("/*", (req, res) => {
  return res.status(400).json({ error: `Ogiltigt REST API-anrop!` });
});
app.put("/*", (req, res) => {
  return res.status(400).json({ error: `Ogiltigt REST API-anrop!` });
});
app.patch("/*", (req, res) => {
  return res.status(400).json({ error: `Ogiltigt REST API-anrop!` });
});
app.delete("/*", (req, res) => {
  return res.status(400).json({ error: `Ogiltigt REST API-anrop!` });
});

// SERVER START!
// Start server listening for incoming requests on port 3000
app.listen(port, () => {
  console.log(`NodeJS-server startad. Lyssnar på API CRUD på port: ${port}`);
});
