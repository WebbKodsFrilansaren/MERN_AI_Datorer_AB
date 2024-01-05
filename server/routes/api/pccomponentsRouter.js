require("dotenv").config();
// This imports Express and uses the in-built router object in Express
const express = require("express");
const router = express.Router();
const path = require("path");
const validateInputs = require("../../middlewares/validateUsersInputs.js");
const crudPCcomponents = require("../../controllers/pccomponentsController.js");

// "multer" to manage uploaded images/files!
const multer = require("multer");
const imgPath = path.join(process.cwd(), "server", "images");
const upload = multer({ dest: imgPath });

// All CRUD routes for /api/pccomponents
router
  .route("/")
  .get(crudPCcomponents.getAllPCcomponents)
  .post(
    validateInputs.postSinglePccomponent,
    upload.array("images", 7),
    crudPCcomponents.postSinglePCcomponent
  ); // GET + POST
router // GET/:id, PUT/:id, DELETE/:id
  .route("/:id")
  .get(
    validateInputs.getSinglePccomponent,
    crudPCcomponents.getSinglePCcomponent
  )
  .put(
    validateInputs.putSinglePccomponent,
    crudPCcomponents.putSinglePCcomponent
  )
  .delete(
    validateInputs.deleteSinglePccomponent,
    crudPCcomponents.deleteSinglePCcomponent
  );

// CATCH ALL in /api/pccomponents route!
router.all("*", (req, res) => {
  if (req.headers.accept.includes("html")) {
    return res.sendFile(path.join(__dirname, "../../images", "easteregg.jpg"));
  }
  return res
    .status(400)
    .json({ error: `Ogiltigt REST API-anrop! <pccomponents.js>` });
});

// Export for use!
module.exports = router;
