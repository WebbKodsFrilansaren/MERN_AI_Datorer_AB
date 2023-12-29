require("dotenv").config();

/*
  MIDDLEWARE to validate Form Input data before sending it further.
  Each exported async function below is for validating data before it is
  next()ed in its CRUD Route. It also clarifies all JSON Body variables used.
*/

// For POST /api/register = When register a new user (NOT by sysadmin)
const registerNewUser = async (req, res, next) => {
  // CHECKS For "username"
  if (!req.body?.username || !req.body.username === "") {
    return res.status(422).json({ error: "Ange ett användarnamn!" });
  }
  if (req.body.username.length < 2 || req.body.username.length > 20) {
    return res
      .status(422)
      .json({ error: "Användarnamnet ska vara mellan 2-20 tecken långt!" });
  }
  const validUsername = /^[a-zA-Z0-9]+$/;
  if (!validUsername.test(req.body.username)) {
    return res.status(422).json({
      error: "Användarnamnet får endast innehålla bokstäver och siffror!",
    });
  }
  const onlyDigits = /^[0-9]+$/;
  if (onlyDigits.test(req.body.username.trim())) {
    return res
      .status(422)
      .json({ error: "Användarnamnet får inte endast innehålla siffror!" });
  }
  const startswithDigit = /^[0-9]/.test(req.body.username);
  if (startswithDigit) {
    return res
      .status(422)
      .json({ error: "Användarnamnet får inte börja med siffror!" });
  }

  // CHECKS For "fullname"
  if (!req.body?.fullname || !req.body?.fullname === "") {
    return res.status(422).json({ error: "Ange ett fullständigt namn!" });
  }

  // CHECKS For "password" & "passwordrepeat"
  if (
    !req.body?.password ||
    !req.body?.password === "" ||
    !req.body?.passwordrepeat ||
    !req.body?.passwordrepeat === "" ||
    req.body?.password !== req.body?.passwordrepeat
  ) {
    return res
      .status(422)
      .json({ error: "Ange ett lösenord och det upprepat!" });
  }
  // Here we know both fields are exactly the same so we only need
  // to check one field knowing it still applies to both fields!
  if (req.body.password.length < 16 || req.body.password.length > 32) {
    return res
      .status(422)
      .json({ error: "Lösenordet ska vara mellan 16-32 tecken långt!" });
  }

  return res.status(200).json({ success: "OK! (registerNewUser)" });
  // When all valid, handle api/register/!
  next();
};

/* CRUD that ONLY sysadmin can use! */
// For GET /api/users
const getUser = async (req, res, next) => {};

// For POST /api/users
const postUser = async (req, res, next) => {};

// For PUT /api/users
const putUser = async (req, res, next) => {};

// For DELETE /api/users
const deleteUser = async (req, res, next) => {};

/* CRUD that ONLY users with correct role can use! (sysadmin can always use them) */
// For GET /api/pccomponents
const getPccomponent = async (req, res, next) => {};

// For POST /api/pccomponents
const postPccomponent = async (req, res, next) => {};

// For PUT /api/pccomponents
const putPccomponent = async (req, res, next) => {};

// For DELETE /api/pccomponents
const deletePccomponent = async (req, res, next) => {};

// Export Middlewares for use!
module.exports = {
  registerNewUser,
  getUser,
  getPccomponent,
  postPccomponent,
  postUser,
  putPccomponent,
  putUser,
  deletePccomponent,
  deleteUser,
};
