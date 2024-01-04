require("dotenv").config();

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
    if (!findUser.roles.includes("get_users")) {
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
    if (!findUser.roles.includes("post_users")) {
      client.close();
      return res
        .status(403)
        .json({ error: "Åtkomst nekad! (Rollen ej tilldelad)" });
    }
    client.close();
    // INSERT CRUD HERE
    // AND change "data:" to correct!
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
    if (!findUser.roles.includes("put_users")) {
      client.close();
      return res
        .status(403)
        .json({ error: "Åtkomst nekad! (Rollen ej tilldelad)" });
    }
    client.close();
    // INSERT CRUD HERE
    // AND change "data:" to correct!
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
};
