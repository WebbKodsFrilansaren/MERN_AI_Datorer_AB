require("dotenv").config();
// This imports Express and uses the in-built router object in Express
const express = require("express");
const router = express.Router();
const path = require("path");
const validateFormInput = require("../../middlewares/validateFormInputs.js");
const crudUsers = require("../../controllers/usersController.js");

// All CRUD routes for /api/users
router.route("/").get(crudUsers.getAllUsers).post(crudUsers.postSingleUser); // GET + POST
router // GET/:id, PUT/:id, DELETE/:id
  .route("/:id")
  .get(crudUsers.getSingleUser)
  .put(crudUsers.putSingleUser)
  .delete(crudUsers.deleteSingleUser);

// CATCH ALL in /api/users route!
router.all("*", (req, res) => {
  if (req.headers.accept.includes("html")) {
    return res.sendFile(path.join(__dirname, "../../images", "easteregg.jpg"));
  }
  return res.status(400).json({ error: `Ogiltigt REST API-anrop! <users.js>` });
});

// Export for use!
module.exports = router;
