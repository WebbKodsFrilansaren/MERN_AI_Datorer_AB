require("dotenv").config();
const bcrypt = require("bcrypt"); // ...bcrypt to encrypt password

// validateFormInput.registerNewUser has already validated all inputs
// so we just check now against the data in the database!
const registerUser = async (req, res) => {
  // Grab only needed req body data, like fillables in PHP!
  const username = req.body.username;
  const useremail = req.body.email.toLowerCase();
  const usernamelc = username.toLowerCase();
  const fullname = req.body.fullname;
  const password = req.body.password;

  // Init MongoDB
  let client;
  try {
    // Then grab maka2207 database and its collection "users"
    client = req.dbClient;
    const dbColUsers = req.dbCol;

    // Check if username OR email is already being used
    const checkSameUser = await dbColUsers.findOne({ usernamelc: usernamelc });
    if (checkSameUser) {
      return res.status(400).json({ error: "Användarnamnet används redan!" });
    }
    const checkSameEmail = await dbColUsers.findOne({ useremail: useremail });
    if (checkSameEmail) {
      return res.status(400).json({ error: "E-postadressen används redan!" });
    }
    // All OK so prepare hashed password!
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user (user must login to get access_token & refresh_token)
    // Standard new user gets ["get_images","get_components"]
    const insertUser = await dbColUsers.insertOne({
      username: username,
      usernamelc: usernamelc,
      useremail: useremail,
      userfullname: fullname,
      userpassword: hashedPassword,
      roles:
        username === "sysadmin" // When "sysadmin" registers they get maximum access!
          ? [
              "get_images",
              "put_images",
              "delete_images",
              "post_images",
              "get_components",
              "put_components",
              "delete_components",
              "post_components",
              "get_users",
              "put_users",
              "delete_users",
              "post_users",
            ]
          : ["get_images", "get_components"], // Normal access level (this is NOT created by 'sysadmin')
      access_token: "",
      refresh_token: "",
      account_blocked: false,
      account_activated: false,
      last_login: "",
    });
    // Check if successful
    if (insertUser) {
      client.close();
      return res
        .status(201)
        .json({ success: "Användare skapad. Vänligen logga in!" });
    } else {
      client.close();
      return res
        .status(500)
        .json({ error: "Databasfel. Kontakta Systemadministratören!" });
    }
  } catch (e) {
    client.close();
    return res
      .status(500)
      .json({ error: "Databasfel. Kontakta Systemadministratören!" });
  }
};

// Export Controller for use!
module.exports = { registerUser };
