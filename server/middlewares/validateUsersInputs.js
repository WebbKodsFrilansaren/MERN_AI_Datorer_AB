require("dotenv").config();
const { isNotBool } = require("../helpers/returnBoolean.js");
/*
  MIDDLEWARE to validate Form Input data before sending it further.
  Each exported async function below is for validating data before it is
  next()ed in its CRUD Route. It also clarifies all JSON Body variables used.

  IMPORTANT: This doesn't check what is stored in database, it only checks
  input data from user (whether from Form and/or REST API directly) and then
  it passes on with next() when all OK. Then after we only check against DB!
*/

// For POST /api/register = When register a new user (NOT by sysadmin)
const registerNewUser = async (req, res, next) => {
  // CHECKS For "username"
  if (!req.body?.username || !req.body.username === "") {
    return res.status(422).json({ error: "Ange ett användarnamn!" });
  }
  if (typeof req.body.username !== "string") {
    return res
      .status(422)
      .json({ error: "Användarnamnet ska vara en sträng!" });
  }
  if (req.body.username.length < 2 || req.body.username.length > 20) {
    return res
      .status(422)
      .json({ error: "Användarnamnet ska vara mellan 2-20 tecken långt!" });
  }
  const validUsername = /^[a-zåäöA-ZÅÄÖ0-9]+$/;
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
  if (typeof req.body.fullname !== "string") {
    return res
      .status(422)
      .json({ error: "Det fullständiga namnet ska vara en sträng!" });
  }
  if (req.body.fullname.length < 6 || req.body.fullname.length > 69) {
    return res
      .status(422)
      .json({ error: "Fullständigt namn bör vara mellan 6-69 tecken långt!" });
  }

  // Check against known invalid characters by checking inside of a spreaded array from the string below
  const invalidCharacters = `<>|§1234567890+?\`½!"#¤%&/()=@£$€{}[]\\¨~/^'*;:_,.-©™®÷×¼¾¡¢¥¦ª«¬¯°±²³´¶·¸¹º»`;
  const invalidCharactersArr = [...invalidCharacters];
  if (invalidCharactersArr.some((char) => req.body.fullname.includes(char))) {
    return res.status(422).json({
      error: "Det fullständiga namnet ska endast innehålla bokstäver!",
    });
  }
  if (!req.body.fullname.trim().includes(" ")) {
    return res.status(422).json({
      error: "Separera för- och efternamn med ett mellanslag!",
    });
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
  if (
    typeof req.body?.password !== "string" ||
    typeof req.body?.passwordrepeat !== "string"
  ) {
    return res.status(422).json({
      error: "Lösenordet och dess upprepning ska båda vara strängar!",
    });
  }
  // Here we know both fields are exactly the same so we only need
  // to check one field knowing it still applies to both fields!
  if (req.body.password.length < 16 || req.body.password.length > 32) {
    return res
      .status(422)
      .json({ error: "Lösenordet ska vara mellan 16-32 tecken långt!" });
  }

  // Valid password is at least 2 numbers, at least 2 special characters,
  // at least 2 uppercase(A-Z) letters and at least 2 lowercase(a-z) letters
  // So, test for all these, count the matches and check for correct number of matches
  const pw = req.body.password;
  const digits = pw.match(/\d/g);
  const digitsCount = digits ? digits.length : 0;
  const lowercaseLetters = pw.match(/[a-z]/g);
  const lowercaseCount = lowercaseLetters ? lowercaseLetters.length : 0;
  const uppercaseLetters = pw.match(/[A-Z]/g);
  const uppercaseCount = uppercaseLetters ? uppercaseLetters.length : 0;
  const specialCharacters = pw.match(/[!@#$%^&*_?-]/g);
  const specialCharCount = specialCharacters ? specialCharacters.length : 0;
  const allowedCharacters = /^[a-zA-Z0-9!@#$%^&*_?-]+$/;
  if (!allowedCharacters.test(pw)) {
    return res.status(422).json({
      error:
        "Lösenordet får endast innehålla stora och små bokstäver(a-z och A-Z), siffror(0-9) och specialtecknen !, @, #, $, %, ^, &, *, -, _, och/eller ?",
    });
  }
  if (digitsCount < 2) {
    return res.status(422).json({
      error: "Lösenordet ska innehålla minst två(2) siffror.",
    });
  }
  if (lowercaseCount < 2) {
    return res.status(422).json({
      error: "Lösenordet ska innehålla minst två(2) små bokstäver(a-z).",
    });
  }
  if (uppercaseCount < 2) {
    return res.status(422).json({
      error: "Lösenordet ska innehålla minst två(2) stora bokstäver(A-Z).",
    });
  }
  if (specialCharCount < 2) {
    return res.status(422).json({
      error:
        "Lösenordet ska innehålla minst två(2) specialtecken som !, @, #, $, %, ^, &, *, -, _, och/eller ?",
    });
  }

  // CHECKS For "email"
  if (!req.body?.email || !req.body?.email === "") {
    return res.status(422).json({ error: "Ange en e-post!" });
  }
  if (typeof req.body.email !== "string") {
    return res.status(422).json({ error: "E-posten ska vara en sträng!" });
  }
  const validEmail = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  if (!validEmail.test(req.body.email)) {
    return res.status(422).json({
      error: "Ange e-post i giltigt format!",
    });
  }
  if (req.body.email.length < 7 || req.body.email.length > 100) {
    return res.status(422).json({
      error: "E-postadressen ska vara mellan 7-100 tecken långt!",
    });
  }
  if (req.body.email.split("@")[0].length < 2) {
    return res.status(422).json({
      error: "Minst 2 tecken framför @ krävs!",
    });
  }
  // When all valid, send it to: api/register/
  next();
};

/* CRUD that ONLY sysadmin can use! */
// For POST /api/users
const postSingleUser = async (req, res, next) => {
  // CHECKS For "username"
  if (!req.body?.username || !req.body.username === "") {
    return res.status(422).json({ error: "Ange ett användarnamn!" });
  }
  if (typeof req.body.username !== "string") {
    return res
      .status(422)
      .json({ error: "Användarnamnet ska vara en sträng!" });
  }
  if (req.body.username.length < 2 || req.body.username.length > 20) {
    return res
      .status(422)
      .json({ error: "Användarnamnet ska vara mellan 2-20 tecken långt!" });
  }
  const validUsername = /^[a-zåäöA-ZÅÄÖ0-9]+$/;
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
  if (typeof req.body.fullname !== "string") {
    return res
      .status(422)
      .json({ error: "Det fullständiga namnet ska vara en sträng!" });
  }
  if (req.body.fullname.length < 6 || req.body.fullname.length > 69) {
    return res
      .status(422)
      .json({ error: "Fullständigt namn bör vara mellan 6-69 tecken långt!" });
  }

  // Check against known invalid characters by checking inside of a spreaded array from the string below
  const invalidCharacters = `<>|§1234567890+?\`½!"#¤%&/()=@£$€{}[]\\¨~/^'*;:_,.-©™®÷×¼¾¡¢¥¦ª«¬¯°±²³´¶·¸¹º»`;
  const invalidCharactersArr = [...invalidCharacters];
  if (invalidCharactersArr.some((char) => req.body.fullname.includes(char))) {
    return res.status(422).json({
      error: "Det fullständiga namnet ska endast innehålla bokstäver!",
    });
  }
  if (!req.body.fullname.trim().includes(" ")) {
    return res.status(422).json({
      error: "Separera för- och efternamn med ett mellanslag!",
    });
  }
  // CHECKS For "password" & "passwordrepeat"
  if (!req.body?.password || !req.body?.password.trim() === "") {
    return res.status(422).json({ error: "Ange ett lösenord!" });
  }
  if (typeof req.body?.password !== "string") {
    return res.status(422).json({
      error: "Lösenordet ska vara en sträng!",
    });
  }
  if (req.body.password.length < 16 || req.body.password.length > 32) {
    return res
      .status(422)
      .json({ error: "Lösenordet ska vara mellan 16-32 tecken långt!" });
  }

  // Valid password is at least 2 numbers, at least 2 special characters,
  // at least 2 uppercase(A-Z) letters and at least 2 lowercase(a-z) letters
  // So, test for all these, count the matches and check for correct number of matches
  const pw = req.body.password;
  const digits = pw.match(/\d/g);
  const digitsCount = digits ? digits.length : 0;
  const lowercaseLetters = pw.match(/[a-z]/g);
  const lowercaseCount = lowercaseLetters ? lowercaseLetters.length : 0;
  const uppercaseLetters = pw.match(/[A-Z]/g);
  const uppercaseCount = uppercaseLetters ? uppercaseLetters.length : 0;
  const specialCharacters = pw.match(/[!@#$%^&*_?-]/g);
  const specialCharCount = specialCharacters ? specialCharacters.length : 0;
  const allowedCharacters = /^[a-zA-Z0-9!@#$%^&*_?-]+$/;
  if (!allowedCharacters.test(pw)) {
    return res.status(422).json({
      error:
        "Lösenordet får endast innehålla stora och små bokstäver(a-z och A-Z), siffror(0-9) och specialtecknen !, @, #, $, %, ^, &, *, -, _, och/eller ?",
    });
  }
  if (digitsCount < 2) {
    return res.status(422).json({
      error: "Lösenordet ska innehålla minst två(2) siffror.",
    });
  }
  if (lowercaseCount < 2) {
    return res.status(422).json({
      error: "Lösenordet ska innehålla minst två(2) små bokstäver(a-z).",
    });
  }
  if (uppercaseCount < 2) {
    return res.status(422).json({
      error: "Lösenordet ska innehålla minst två(2) stora bokstäver(A-Z).",
    });
  }
  if (specialCharCount < 2) {
    return res.status(422).json({
      error:
        "Lösenordet ska innehålla minst två(2) specialtecken som !, @, #, $, %, ^, &, *, -, _, och/eller ?",
    });
  }

  // CHECKS For "email"
  if (!req.body?.email || !req.body?.email === "") {
    return res.status(422).json({ error: "Ange en e-post!" });
  }
  if (typeof req.body.email !== "string") {
    return res.status(422).json({ error: "E-posten ska vara en sträng!" });
  }
  const validEmail = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  if (!validEmail.test(req.body.email)) {
    return res.status(422).json({
      error: "Ange e-post i giltigt format!",
    });
  }
  if (req.body.email.length < 7 || req.body.email.length > 100) {
    return res.status(422).json({
      error: "E-postadressen ska vara mellan 7-100 tecken långt!",
    });
  }
  if (req.body.email.split("@")[0].length < 2) {
    return res.status(422).json({
      error: "Minst 2 tecken framför @ krävs!",
    });
  }

  // CHECKS For Booleans (activated, blocked, roles:can_xyz)
  if (isNotBool(req.body, "account_activated")) {
    return res.status(422).json({
      error: "Välj om konto ska vara (in)aktiverat vid skapande!",
    });
  }
  if (isNotBool(req.body, "account_blocked")) {
    return res.status(422).json({
      error: "Välj om konto ska vara (av)blockerat vid skapande!",
    });
  }
  if (isNotBool(req.body, "can_get_images")) {
    return res.status(422).json({
      error: "Välj om konto ska kunna få visa bilder!",
    });
  }
  if (isNotBool(req.body, "can_post_images")) {
    return res.status(422).json({
      error: "Välj om konto ska kunna få ladda upp bilder!",
    });
  }
  if (isNotBool(req.body, "can_put_images")) {
    return res.status(422).json({
      error: "Välj om konto ska kunna få ändra uppladdade bilder!",
    });
  }
  if (isNotBool(req.body, "can_delete_images")) {
    return res.status(422).json({
      error: "Välj om konto ska kunna få radera uppladdade bilder!",
    });
  }
  if (isNotBool(req.body, "can_get_components")) {
    return res.status(422).json({
      error: "Välj om konto ska kunna få visa datorkomponenter!",
    });
  }
  if (isNotBool(req.body, "can_post_components")) {
    return res.status(422).json({
      error: "Välj om konto ska kunna få lägga upp datorkomponenter!",
    });
  }
  if (isNotBool(req.body, "can_put_components")) {
    return res.status(422).json({
      error: "Välj om konto ska kunna få ändra upplagda datorkomponenter!",
    });
  }
  if (isNotBool(req.body, "can_delete_components")) {
    return res.status(422).json({
      error: "Välj om konto ska kunna få radera upplagda datorkomponenter!",
    });
  }
  // All OK, send to "postSingleUser" const in usersController.js
  next();
};

// For PUT /api/users/:id
const putSingleUser = async (req, res, next) => {
  // Check /:id param is valid integer!
  const isInteger = /^[0-9]+$/.test(req.params?.id);
  if (
    !req.params?.id ||
    typeof req.params?.id !== "string" ||
    isNaN(req.params?.id) ||
    !isInteger
  ) {
    return res.status(422).json({ error: "Ange ett heltal!" });
  }
  // CHECKS For "username"
  if (!req.body?.username || !req.body.username === "") {
    return res.status(422).json({ error: "Ange ett användarnamn!" });
  }
  if (req.body?.username.toLowerCase() === "sysadmin") {
    return res.status(401).json({ error: "Användarnamnet används redan!" });
  }
  if (typeof req.body.username !== "string") {
    return res
      .status(422)
      .json({ error: "Användarnamnet ska vara en sträng!" });
  }
  if (req.body.username.length < 2 || req.body.username.length > 20) {
    return res
      .status(422)
      .json({ error: "Användarnamnet ska vara mellan 2-20 tecken långt!" });
  }
  const validUsername = /^[a-zåäöA-ZÅÄÖ0-9]+$/;
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
  if (typeof req.body.fullname !== "string") {
    return res
      .status(422)
      .json({ error: "Det fullständiga namnet ska vara en sträng!" });
  }
  if (req.body?.fullname.toLowerCase().includes("systemadministratör")) {
    return res
      .status(401)
      .json({ error: "Detta fullständiga namn får ej användas!" });
  }
  if (req.body.fullname.length < 6 || req.body.fullname.length > 69) {
    return res
      .status(422)
      .json({ error: "Fullständigt namn bör vara mellan 6-69 tecken långt!" });
  }

  // Check against known invalid characters by checking inside of a spreaded array from the string below
  const invalidCharacters = `<>|§1234567890+?\`½!"#¤%&/()=@£$€{}[]\\¨~/^'*;:_,.-©™®÷×¼¾¡¢¥¦ª«¬¯°±²³´¶·¸¹º»`;
  const invalidCharactersArr = [...invalidCharacters];
  if (invalidCharactersArr.some((char) => req.body.fullname.includes(char))) {
    return res.status(422).json({
      error: "Det fullständiga namnet ska endast innehålla bokstäver!",
    });
  }
  if (!req.body.fullname.trim().includes(" ")) {
    return res.status(422).json({
      error: "Separera för- och efternamn med ett mellanslag!",
    });
  }

  // CHECKS For "email"
  if (!req.body?.email || !req.body?.email === "") {
    return res.status(422).json({ error: "Ange en e-post!" });
  }
  if (typeof req.body.email !== "string") {
    return res.status(422).json({ error: "E-posten ska vara en sträng!" });
  }
  if (req.body?.email === "sysadmin@aidatorer.se") {
    return res.status(401).json({ error: "E-postadressen används redan!" });
  }
  const validEmail = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  if (!validEmail.test(req.body.email)) {
    return res.status(422).json({
      error: "Ange e-post i giltigt format!",
    });
  }
  if (req.body.email.length < 7 || req.body.email.length > 100) {
    return res.status(422).json({
      error: "E-postadressen ska vara mellan 7-100 tecken långt!",
    });
  }
  if (req.body.email.split("@")[0].length < 2) {
    return res.status(422).json({
      error: "Minst 2 tecken framför @ krävs!",
    });
  }

  // CHECKS For Booleans (activated, blocked, roles:can_xyz)
  if (isNotBool(req.body, "account_activated")) {
    return res.status(422).json({
      error: "Välj om konto ska vara (in)aktiverat vid skapande!",
    });
  }
  if (isNotBool(req.body, "account_blocked")) {
    return res.status(422).json({
      error: "Välj om konto ska vara (av)blockerat vid skapande!",
    });
  }
  if (isNotBool(req.body, "can_get_images")) {
    return res.status(422).json({
      error: "Välj om konto ska kunna få visa bilder!",
    });
  }
  if (isNotBool(req.body, "can_post_images")) {
    return res.status(422).json({
      error: "Välj om konto ska kunna få ladda upp bilder!",
    });
  }
  if (isNotBool(req.body, "can_put_images")) {
    return res.status(422).json({
      error: "Välj om konto ska kunna få ändra uppladdade bilder!",
    });
  }
  if (isNotBool(req.body, "can_delete_images")) {
    return res.status(422).json({
      error: "Välj om konto ska kunna få radera uppladdade bilder!",
    });
  }
  if (isNotBool(req.body, "can_get_components")) {
    return res.status(422).json({
      error: "Välj om konto ska kunna få visa datorkomponenter!",
    });
  }
  if (isNotBool(req.body, "can_post_components")) {
    return res.status(422).json({
      error: "Välj om konto ska kunna få lägga upp datorkomponenter!",
    });
  }
  if (isNotBool(req.body, "can_put_components")) {
    return res.status(422).json({
      error: "Välj om konto ska kunna få ändra upplagda datorkomponenter!",
    });
  }
  if (isNotBool(req.body, "can_delete_components")) {
    return res.status(422).json({
      error: "Välj om konto ska kunna få radera upplagda datorkomponenter!",
    });
  }
  // CHECKS For "password" | password is OPTIONAL when updating user
  // so if it's empty (""), then it's considered not wanted to be changed!
  if (req.body.password.trim() !== "") {
    // Further checks if password is NOT empty meaning it wanted to be changed for user!
    if (typeof req.body?.password !== "string") {
      return res.status(422).json({
        error: "Lösenordet ska vara en sträng!",
      });
    }
    if (req.body.password.length < 16 || req.body.password.length > 32) {
      return res
        .status(422)
        .json({ error: "Lösenordet ska vara mellan 16-32 tecken långt!" });
    }

    // Valid password is at least 2 numbers, at least 2 special characters,
    // at least 2 uppercase(A-Z) letters and at least 2 lowercase(a-z) letters
    // So, test for all these, count the matches and check for correct number of matches
    const pw = req.body.password;
    const digits = pw.match(/\d/g);
    const digitsCount = digits ? digits.length : 0;
    const lowercaseLetters = pw.match(/[a-z]/g);
    const lowercaseCount = lowercaseLetters ? lowercaseLetters.length : 0;
    const uppercaseLetters = pw.match(/[A-Z]/g);
    const uppercaseCount = uppercaseLetters ? uppercaseLetters.length : 0;
    const specialCharacters = pw.match(/[!@#$%^&*_?-]/g);
    const specialCharCount = specialCharacters ? specialCharacters.length : 0;
    const allowedCharacters = /^[a-zA-Z0-9!@#$%^&*_?-]+$/;
    if (!allowedCharacters.test(pw)) {
      return res.status(422).json({
        error:
          "Lösenordet får endast innehålla stora och små bokstäver(a-z och A-Z), siffror(0-9) och specialtecknen !, @, #, $, %, ^, &, *, -, _, och/eller ?",
      });
    }
    if (digitsCount < 2) {
      return res.status(422).json({
        error: "Lösenordet ska innehålla minst två(2) siffror.",
      });
    }
    if (lowercaseCount < 2) {
      return res.status(422).json({
        error: "Lösenordet ska innehålla minst två(2) små bokstäver(a-z).",
      });
    }
    if (uppercaseCount < 2) {
      return res.status(422).json({
        error: "Lösenordet ska innehålla minst två(2) stora bokstäver(A-Z).",
      });
    }
    if (specialCharCount < 2) {
      return res.status(422).json({
        error:
          "Lösenordet ska innehålla minst två(2) specialtecken som !, @, #, $, %, ^, &, *, -, _, och/eller ?",
      });
    }
    // All ok even when checking password | Pass onto const putSingleUser in usersController.js
    next();
  }
  // Pass onto const putSingleUser in usersController.js WITHOUT any password (empty password)
  else {
    next();
  }
};

// For DELETE /api/users/:id
const deleteSingleUser = async (req, res, next) => {
  // Check /:id param is valid integer!
  const isInteger = /^[0-9]+$/.test(req.params?.id);
  if (
    !req.params?.id ||
    typeof req.params?.id !== "string" ||
    isNaN(req.params?.id) ||
    !isInteger
  ) {
    return res.status(422).json({ error: "Ange ett heltal!" });
  }
  next();
};

/* CRUD that ONLY users with correct role can use! (sysadmin can always use them) */
// For GET /api/pccomponents  (this gets ALL pccomponents)
const getSinglePccomponent = async (req, res, next) => {
  // Check /:id param is valid integer!
  const isInteger = /^[0-9]+$/.test(req.params?.id);
  if (
    !req.params?.id ||
    typeof req.params?.id !== "string" ||
    isNaN(req.params?.id) ||
    !isInteger
  ) {
    return res.status(422).json({ error: "Ange ett heltal!" });
  }
  next();
};

// For POST /api/pccomponents/:id
const postSinglePccomponent = async (req, res, next) => {};

// For PUT /api/pccomponents/:id
const putSinglePccomponent = async (req, res, next) => {
  // Check /:id param is valid integer!
  const isInteger = /^[0-9]+$/.test(req.params?.id);
  if (
    !req.params?.id ||
    typeof req.params?.id !== "string" ||
    isNaN(req.params?.id) ||
    !isInteger
  ) {
    return res.status(422).json({ error: "Ange ett heltal!" });
  }
  next();
};

// For DELETE /api/pccomponents/:id
const deleteSinglePccomponent = async (req, res, next) => {
  // Check /:id param is valid integer!
  const isInteger = /^[0-9]+$/.test(req.params?.id);
  if (
    !req.params?.id ||
    typeof req.params?.id !== "string" ||
    isNaN(req.params?.id) ||
    !isInteger
  ) {
    return res.status(422).json({ error: "Ange ett heltal!" });
  }
  next();
};

// Export Middlewares for use!
module.exports = {
  registerNewUser,
  getSinglePccomponent,
  postSinglePccomponent,
  postSingleUser,
  putSinglePccomponent,
  putSingleUser,
  deleteSinglePccomponent,
  deleteSingleUser,
};
