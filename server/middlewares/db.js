require("dotenv").config();
const { MongoClient } = require("mongodb");
const dbURL = process.env.MONGO_URL;

// MIDDLEWARE: Database connection to chosen database & collection(s)
const db =
  (dbName, colName, colName2 = "") =>
  async (req, res, next) => {
    try {
      const client = new MongoClient(dbURL);
      await client.connect();
      // Attack MongoDB client connection and its final DB Connection to its chosen collection
      req.dbClient = client;
      req.dbCol = client.db(dbName).collection(colName);

      // Also include a secondary collection if needed!
      req.dbCol2 = "";
      if (colName2 != "") {
        req.dbCol2 = client.db(dbName).collection(colName2);
      }
      next();
    } catch (e) {
      return res.status(500).json({
        error:
          "Kunde ej ansluta till REST API:s databas. Kontakta Systemadministratören!",
      });
    }
  };

module.exports = db;
