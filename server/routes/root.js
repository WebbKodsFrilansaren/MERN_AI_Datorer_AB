require("dotenv").config();
// This imports Express and uses the in-built router object in Express
const express = require("express");
const router = express.Router();
const path = require("path");
const validateJWT = require("../middlewares/validateJWT.js");
const mongoDB = require("../middlewares/db.js");
const refreshatoken = require("../controllers/refreshATokenController.js");
const loginlogout = require("../controllers/loginAndLogoutController.js");
const registerUser = require("../controllers/registerUserController.js");

/*
   Different /api/{sub-routes} |
   NO SECURITY DEMANDED: No JWT needed!
   (even though you cannot log out
    if you've never logged in!)
*/
// Login user
router.use("/login", mongoDB("maka2207", "users"), loginlogout.loginPOST);

// Register new user
router.use(
  "/register",
  mongoDB("maka2207", "users"),
  registerUser.registerUser
);

// Logout current user
router.use("/logout", mongoDB("maka2207", "users"), loginlogout.logoutPOST);

// /api/refreshatoken = Refresh Access Token by using the (hopefully) still valid httpOnly secured JWT cookie (refresh_token in db, jwt in cookies)
router.use(
  "/refreshatoken",
  mongoDB("maka2207", "users"),
  refreshatoken.refreshAToken
);

/*  Different /api/{sub-routes} |
    SECURITY DEMANDED: MUST CHECK JWT(Access Token) FIRST!
*/
// Always validate correct Access Token first!
router.use(validateJWT);

// Router for CRUD for pccomponents
router.use("/pccomponents", require("./api/pccomponentsRouter.js"));

// Router for CRUD for users
router.use("/users", require("./api/usersRouter.js"));

// This is the LAST one because if we have it before others it will be ran and stop the rest of the script!
// This is the "catch-all" responses for CRUD when someone is requesting something that does not exist.
router.all("*", (req, res) => {
  if (req.headers.accept.includes("html")) {
    return res.sendFile(path.join(__dirname, "../images", "easteregg.jpg"));
  }
  return res.status(400).json({ error: `Ogiltigt REST API-anrop! <root.js>` });
});

// Export it so it can be used by `app.js` in root folder.
module.exports = router;
