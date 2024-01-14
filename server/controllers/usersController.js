require("dotenv").config();
const bcrypt = require("bcrypt");

// GET /api/users/
const getAllUsers = async (req, res) => {
  // Check for authData req object's existence first
  if (!req.authData || !req.authData?.username) {
    return res.status(403).json({ error: "Åtkomst nekad!" });
  }
  // Then grab its variables to check against in database
  const username = req.authData.username;
  // Init MongoDB
  let client;
  try {
    // Then grab maka2207 database and its collection "users"
    client = req.dbClient;
    const dbColUsers = req.dbCol;
    // Find correct user making the request
    const findUser = await dbColUsers.findOne({ username: username });
    if (!findUser) {
      client.close();
      return res
        .status(403)
        .json({ error: "Åtkomst nekad! (Ingen användare)" });
    }
    // Then check if they are authorized to continue the request
    if (
      !findUser.roles.includes("get_users") ||
      findUser.username !== "sysadmin"
    ) {
      client.close();
      return res
        .status(403)
        .json({ error: "Åtkomst nekad! (Rollen ej tilldelad)" });
    }
    // Grab all users whose `username` are NOT equal to 'sysadmin' converted to array
    const returnUsersData = await dbColUsers
      .find({
        username: { $ne: "sysadmin" },
      })
      .toArray();
    // Then check if empty
    if (
      !returnUsersData ||
      returnUsersData === "[]" ||
      returnUsersData == [] ||
      returnUsersData === "{}" ||
      returnUsersData == {} ||
      returnUsersData?.length === 0
    ) {
      client.close();
      return res.status(404).json({
        error:
          "Det omöjliga har inträffat: Inga användare finns men du lyckades ändå söka efter dem?!",
      });
    }

    // Map to a new object to filter out data and then finally return it
    const filterData = returnUsersData.map((user) => {
      return {
        userid: user.userid,
        username: user.username,
        useremail: user.useremail,
        userfullname: user.userfullname,
        access_token:
          user.access_token == ""
            ? "Utgått/Utloggad"
            : user.access_token.substring(0, 10) + "...",
        refresh_token:
          user.refresh_token == ""
            ? "Utgått/Utloggad"
            : user.refresh_token.substring(0, 10) + "...",
        account_blocked: user.account_blocked ? "Ja" : "Nej",
        account_activated: user.account_activated ? "Ja" : "Nej",
        roles: user.roles,
        last_login: user.last_login == "" ? "Aldrig inloggad" : user.last_login,
      };
    });
    client.close();
    return res
      .status(200)
      .json({ success: "Alla användare hämtade!", data: filterData });
  } catch (e) {
    client.close();
    return res
      .status(500)
      .json({ error: "Databasfel. Kontakta Systemadministratören!" });
  }
};

// GET /api/users/:id
const getSingleUser = async (req, res) => {
  // Check for authData req object's existence first
  if (!req.authData || !req.authData?.username) {
    return res.status(403).json({ error: "Åtkomst nekad!" });
  }
  // Grab validated integer that will used to find `userid`
  const validID = parseInt(req.params.id);

  // Then grab its variables to check against in database
  const username = req.authData.username;
  // Init MongoDB
  let client;
  try {
    // Then grab maka2207 database and its collection "users"
    client = req.dbClient;
    const dbColUsers = req.dbCol;
    // Find correct user making the request
    const findUser = await dbColUsers.findOne({ username: username });
    if (!findUser) {
      client.close();
      return res
        .status(403)
        .json({ error: "Åtkomst nekad! (Ingen användare)" });
    }
    // Then check if they are authorized to continue the request
    if (
      !findUser.roles.includes("get_users") ||
      findUser.username !== "sysadmin"
    ) {
      client.close();
      return res
        .status(403)
        .json({ error: "Åtkomst nekad! (Rollen ej tilldelad)" });
    }

    // Try find user to return
    const findSingleUser = await dbColUsers.findOne({ userid: validID });
    if (!findSingleUser) {
      client.close();
      return res
        .status(404)
        .json({ error: `Användare med id:${validID} finns ej!` });
    }
    // If user is 'sysadmin', then cannot update!
    if (findSingleUser.username === "sysadmin") {
      client.close();
      return res.status(404).json({ error: `Denna användare kan ej hämtas!` });
    }
    // User found and can be returned, prepare it
    const returnedSingleUser = {
      userid: findSingleUser.userid,
      username: findSingleUser.username,
      useremail: findSingleUser.useremail,
      userfullname: findSingleUser.userfullname,
      access_token:
        findSingleUser.access_token == ""
          ? "Utgått/Utloggad"
          : findSingleUser.access_token.substring(0, 10) + "...",
      refresh_token:
        findSingleUser.refresh_token == ""
          ? "Utgått/Utloggad"
          : findSingleUser.refresh_token.substring(0, 10) + "...",
      account_blocked: findSingleUser.account_blocked ? "Ja" : "Nej",
      account_activated: findSingleUser.account_activated ? "Ja" : "Nej",
      roles: findSingleUser.roles,
      last_login:
        findSingleUser.last_login == ""
          ? "Aldrig inloggad"
          : findSingleUser.last_login,
    };
    // Finally return single user and close DB
    client.close();
    return res
      .status(200)
      .json({ success: "Användaren finns!", data: returnedSingleUser });
  } catch (e) {
    client.close();
    return res
      .status(500)
      .json({ error: "Databasfel. Kontakta Systemadministratören!" });
  }
};

// POST /api/users
const postSingleUser = async (req, res) => {
  // Check for authData req object's existence first
  if (!req.authData || !req.authData?.username) {
    return res.status(403).json({ error: "Åtkomst nekad!" });
  }
  // Then grab its variables to check against in database
  const username = req.authData.username;
  // Init MongoDB
  let client;
  let nextUserId = 1;
  try {
    // Then grab maka2207 database and its collection "users"
    client = req.dbClient;
    const dbColUsers = req.dbCol;
    // Find correct user making the request
    const findUser = await dbColUsers.findOne({ username: username });
    if (!findUser) {
      client.close();
      return res
        .status(403)
        .json({ error: "Åtkomst nekad! (Ingen användare)" });
    }
    // Then check if they are authorized to continue the request
    if (
      !findUser.roles.includes("post_users") ||
      findUser.username !== "sysadmin"
    ) {
      client.close();
      return res
        .status(403)
        .json({ error: "Åtkomst nekad! (Rollen ej tilldelad)" });
    }

    // First find either an already username or already email being used
    const findExistingUserOrEmail = await dbColUsers.findOne({
      $or: [
        { usernamelc: req.body.username.toLowerCase() },
        { useremail: req.body.email.toLowerCase() },
      ],
    });

    // If we do NOT return null, username or useremail already exists
    if (findExistingUserOrEmail) {
      client.close();
      return res.status(400).json({
        error: "Användarnamnet eller e-postadressen används redan!",
      });
    }

    // Find highest current value of `userid` by sorting it from max value and just
    const highestUserId = await dbColUsers
      .find()
      .sort({ userid: -1 })
      .limit(1)
      .next();

    // If DOES exist then nextUserId is that plus one, otherwise it is the first user!
    if (highestUserId) {
      nextUserId = highestUserId.userid + 1;
    }

    // Prepare roles from req.body.can_XYZ
    const allRoles = [
      req.body.can_get_images ? "get_images" : "",
      req.body.can_put_images ? "put_images" : "",
      req.body.can_post_images ? "post_images" : "",
      req.body.can_delete_images ? "delete_images" : "",
      req.body.can_get_components ? "get_components" : "",
      req.body.can_put_components ? "put_components" : "",
      req.body.can_post_components ? "post_components" : "",
      req.body.can_delete_components ? "delete_components" : "",
    ];
    // Remove all empty elements("") by filtering
    const roles = allRoles.filter((role) => role !== "");

    // Prepare new user to insert
    const userpw = await bcrypt.hash(req.body.password, 10);
    const postNewUser = {
      username: req.body.username,
      usernamelc: req.body.username.toLowerCase(),
      userpassword: userpw,
      useremail: req.body.email.toLowerCase(),
      userfullname: req.body.fullname,
      usernamelc: req.body.username.toLowerCase(),
      account_blocked: req.body.account_blocked ? true : false,
      account_activated: req.body.account_activated ? true : false,
      access_token: "",
      refresh_token: "",
      roles: roles,
      last_login: "",
      userid: nextUserId,
    };

    // Try insert new user
    const insertNewUser = await dbColUsers.insertOne(postNewUser);

    // If = succeeded to insert new user | else = failed to insert new user
    if (insertNewUser) {
      client.close();
      return res.status(201).json({ success: "En ny användare har skapats!" });
    } else {
      client.close();
      return res
        .status(500)
        .json({ error: "Misslyckades att skapa ny användare!" });
    }
  } catch (e) {
    client.close();
    return res
      .status(500)
      .json({ error: "Databasfel. Kontakta Systemadministratören!" });
  }
};

// PUT /api/users/:id
const putSingleUser = async (req, res) => {
  // Check for authData req object's existence first
  if (!req.authData || !req.authData?.username) {
    return res.status(403).json({ error: "Åtkomst nekad!" });
  }
  // Grab validated integer that will used to find `userid`
  const validID = parseInt(req.params.id);

  // Then grab its variables to check against in database
  const username = req.authData.username;
  // Init MongoDB
  let client;
  try {
    // Then grab maka2207 database and its collection "users"
    client = req.dbClient;
    const dbColUsers = req.dbCol;
    // Find correct user making the request
    const findUser = await dbColUsers.findOne({ username: username });
    if (!findUser) {
      client.close();
      return res
        .status(403)
        .json({ error: "Åtkomst nekad! (Ingen användare)" });
    }
    // Then check if they are authorized to continue the request
    if (
      !findUser.roles.includes("put_users") ||
      findUser.username !== "sysadmin"
    ) {
      client.close();
      return res
        .status(403)
        .json({ error: "Åtkomst nekad! (Rollen ej tilldelad)" });
    }

    // Try find user to update first
    const findUserToUpdate = await dbColUsers.findOne({ userid: validID });
    if (!findUserToUpdate) {
      client.close();
      return res
        .status(404)
        .json({ error: `Användare med id:${validID} finns ej!` });
    }
    // If user is 'sysadmin', then cannot update!
    if (findUserToUpdate.username === "sysadmin") {
      client.close();
      return res
        .status(404)
        .json({ error: `Denna användare kan ej uppdateras!` });
    }

    // Check so changed email and/or username doesn't already exist!
    const loweredUsername = req.body.username.toLowerCase();
    const loweredEmail = req.body.email.toLowerCase();
    const currentUsername = findUserToUpdate.username.toLowerCase();
    const currentEmail = findUserToUpdate.useremail.toLowerCase();

    // Check so username or useremail is not already taken while excluding user to update
    // otherwise it will fail to update because it will think current user is "already taken"
    const findExistingUserOrEmail = await dbColUsers.findOne({
      $and: [
        // "and" means that both "or"-arrays must be true (by one inside of each one of the "ors" is true!)
        {
          // First find either an already username or already email being used
          $or: [{ usernamelc: loweredUsername }, { useremail: loweredEmail }],
        },
        {
          // Then also check that document excludes current user's username & email
          $or: [
            { usernamelc: { $ne: currentUsername } },
            { useremail: { $ne: currentEmail } },
          ],
        },
      ], // This "and" is considered a match when both "or" find one of their respective usernames or emails
    });

    // If we do NOT return null, username or useremail already exists
    if (findExistingUserOrEmail) {
      client.close();
      return res.status(400).json({
        error: "Användarnamnet eller e-postadressen används redan!",
      });
    }

    // Prepare roles from req.body.can_XYZ
    const allRoles = [
      req.body.can_get_images ? "get_images" : "",
      req.body.can_put_images ? "put_images" : "",
      req.body.can_post_images ? "post_images" : "",
      req.body.can_delete_images ? "delete_images" : "",
      req.body.can_get_components ? "get_components" : "",
      req.body.can_put_components ? "put_components" : "",
      req.body.can_post_components ? "post_components" : "",
      req.body.can_delete_components ? "delete_components" : "",
    ];
    // Remove all empty elements("") by filtering
    const roles = allRoles.filter((role) => role !== "");

    // Create updated user object
    const updateUser = {
      username: req.body.username,
      useremail: req.body.email.toLowerCase(),
      userfullname: req.body.fullname,
      usernamelc: req.body.username.toLowerCase(),
      account_blocked: req.body.account_blocked ? true : false,
      account_activated: req.body.account_activated ? true : false,
      roles: roles,
    };
    // Check if password was given (you can update user without updating their password!)
    if (req.body.password.trim() !== "") {
      updateUser.userpassword = await bcrypt.hash(req.body.password, 10);
    }

    // If allowed to update found user, try updating user!
    const tryUpdateUser = await dbColUsers.updateOne(
      { userid: validID },
      { $set: updateUser }
    );

    if (!tryUpdateUser) {
      client.close();
      return res
        .status(500)
        .json({ error: "Misslyckades att uppdatera användaren!" });
    } else {
      client.close();
      return res.status(200).json({ success: "Användaren har uppdaterats!" });
    }
  } catch (e) {
    client.close();
    return res
      .status(500)
      .json({ error: "Databasfel. Kontakta Systemadministratören!" });
  }
};

// DELETE /api/users/:id
const deleteSingleUser = async (req, res) => {
  // Check for authData req object's existence first
  if (!req.authData || !req.authData?.username) {
    return res.status(403).json({ error: "Åtkomst nekad!" });
  }
  // Grab validated integer that will used to find `userid`
  const validID = parseInt(req.params.id);

  // Then grab its variables to check against in database
  const username = req.authData.username;
  // Init MongoDB
  let client;
  try {
    // Then grab maka2207 database and its collection "users"
    client = req.dbClient;
    const dbColUsers = req.dbCol;
    // Find correct user making the request
    const findUser = await dbColUsers.findOne({ username: username });
    if (!findUser) {
      client.close();
      return res
        .status(403)
        .json({ error: "Åtkomst nekad! (Ingen användare)" });
    }
    // Then check if they are authorized to continue the request
    if (
      !findUser.roles.includes("delete_users") ||
      findUser.username !== "sysadmin"
    ) {
      client.close();
      return res
        .status(403)
        .json({ error: "Åtkomst nekad! (Rollen ej tilldelad)" });
    }

    // Try find user to delete first
    const findUserToDelete = await dbColUsers.findOne({ userid: validID });
    if (!findUserToDelete) {
      client.close();
      return res
        .status(404)
        .json({ error: `Användare med id:${validID} finns ej!` });
    }
    // If user is 'sysadmin', then cannot delete!
    if (findUserToDelete.username === "sysadmin") {
      client.close();
      return res.status(404).json({ error: `Denna användare kan ej raderas!` });
    }
    // Then delete user
    const deleteFoundUser = await dbColUsers.deleteOne({ userid: validID });

    // When success
    if (deleteFoundUser.deletedCount > 0) {
      client.close();
      return res
        .status(200)
        .json({ success: `Användaren med id:${validID} har raderats!` });
    } // When fail
    else {
      return res.status(500).json({
        error: `Misslyckades att radera användaren med id:${validID}!`,
      });
    }
  } catch (e) {
    client.close();
    return res
      .status(500)
      .json({ error: "Databasfel. Kontakta Systemadministratören!" });
  }
};

// Export CRUDs for use!
module.exports = {
  getAllUsers,
  putSingleUser,
  postSingleUser,
  deleteSingleUser,
  getSingleUser,
};
