require("dotenv").config();

// GET /api/pccomponents/
const getAllPCcomponents = async (req, res) => {
  // Check for authData req object's existence first
  if (!req.authData || !req.authData?.username) {
    return res.status(403).json({ error: "Åtkomst nekad!" });
  }
  // Then grab its variables to check against in database
  const username = req.authData.username;
  // Init MongoDB
  let client;
  try {
    // Then grab maka2207 database and its collection "pccomponents"
    client = req.dbClient;
    const dbColUsers = req.dbCol;
    const dbColPCComponents = req.dbCol2;

    // Find correct user making the request
    const findUser = await dbColUsers.findOne({ username: username });
    if (!findUser) {
      client.close();
      return res
        .status(403)
        .json({ error: "Åtkomst nekad! (Ingen användare)" });
    }
    // Then check if they are authorized to continue the request
    if (!findUser.roles.includes("get_components")) {
      client.close();
      return res
        .status(403)
        .json({ error: "Åtkomst nekad! (Rollen ej tilldelad)" });
    }

    // Check if user also is allowed to get images when data is returned!
    let includeImgFiles = true;
    if (!findUser.roles.includes("get_images")) {
      includeImgFiles = false;
    }
    // Grab PCComponents and check if they exist
    const returnPCComponentsData = await dbColPCComponents.find().toArray();
    if (
      !returnPCComponentsData ||
      returnPCComponentsData === "[]" ||
      returnPCComponentsData == [] ||
      returnPCComponentsData === "{}" ||
      returnPCComponentsData == {} ||
      returnPCComponentsData?.length === 0
    ) {
      client.close();
      return res.status(404).json({
        error:
          "Kontakta Systemadministratören för alla datorkomponenter är borta?!",
      });
    }

    // Then filter out based on get_images or not role designation
    filterData = returnPCComponentsData.map((component) => {
      return {
        componentid: component.componentid,
        componentName: component.componentName,
        componentDescription: component.componentDescription,
        componentPrice: component.componentPrice,
        componentAmount: component.componentAmount,
        componentStatus: component.componentStatus,
        componentCategories: component.componentCategories,
        componentImages: includeImgFiles ? component.componentImages : "",
      };
    });

    // Finally return filtered PC Components!
    client.close();
    return res.status(200).json({
      success: "Alla datorkomponenter hämtade!",
      data: filterData,
    });
  } catch (e) {
    client.close();
    return res
      .status(500)
      .json({ error: "Databasfel. Kontakta Systemadministratören!\n" + e });
  }
};

// GET /api/pccomponents/:id
const getSinglePCcomponent = async (req, res) => {
  // Check for authData req object's existence first
  if (!req.authData || !req.authData?.username) {
    return res.status(403).json({ error: "Åtkomst nekad!" });
  }

  // Grab integer from `req.params`
  const validID = parseInt(req.params.id);

  // Then grab username to check against in database
  const username = req.authData.username;
  // Init MongoDB
  let client;
  try {
    // Then grab maka2207 database and its collections:
    client = req.dbClient;
    const dbColUsers = req.dbCol; // "users"
    const dbColPCComponents = req.dbCol2; // "pccomponents"

    // Find correct user making the request
    const findUser = await dbColUsers.findOne({ username: username });
    if (!findUser) {
      client.close();
      return res
        .status(403)
        .json({ error: "Åtkomst nekad! (Ingen användare)" });
    }
    // Then check if they are authorized to continue the request
    if (!findUser.roles.includes("get_components")) {
      client.close();
      return res
        .status(403)
        .json({ error: "Åtkomst nekad! (Rollen ej tilldelad)" });
    }

    // Check if user also is allowed to get images when data is returned!
    let includeImgFiles = true;
    if (!findUser.roles.includes("get_images")) {
      includeImgFiles = false;
    }
    // Grab PCComponent and filter out based on get_images access:
    const findSingleComponent = await dbColPCComponents.findOne({
      componentid: validID,
    });

    // PCComponent with /:id doesn't exist
    if (!findSingleComponent) {
      client.close();
      return res.status(404).json({
        error: `Datorkomponenten med id:${validID} finns inte!`,
      });
    }

    // When it exists, return it filtered with images or without
    filterData = {
      componentid: findSingleComponent.componentid,
      componentName: findSingleComponent.componentName,
      componentDescription: findSingleComponent.componentDescription,
      componentPrice: findSingleComponent.componentPrice,
      componentAmount: findSingleComponent.componentAmount,
      componentStatus: findSingleComponent.componentStatus,
      componentCategories: findSingleComponent.componentCategories,
      componentImages: includeImgFiles
        ? findSingleComponent.componentImages
        : "",
    };

    // Finally return the single filtered PC Component!
    client.close();
    return res.status(200).json({
      success: "Datorkomponent hämtad!",
      data: filterData,
    });
  } catch (e) {
    client.close();
    return res
      .status(500)
      .json({ error: "Databasfel. Kontakta Systemadministratören!" });
  }
};

// POST /api/pccomponents
const postSinglePCcomponent = async (req, res) => {
  return res.status(200).json({ success: "POST Single PCComponent!" });
};

// PUT /api/pccomponents/:id
const putSinglePCcomponent = async (req, res) => {
  // Check for authData req object's existence first
  if (!req.authData || !req.authData?.username) {
    return res.status(403).json({ error: "Åtkomst nekad!" });
  }

  // Grab integer from `req.params`
  const validID = parseInt(req.params.id);

  // Then grab username to check against in database
  const username = req.authData.username;
  // Init MongoDB
  let client;
  try {
    // Then grab maka2207 database and its collections:
    client = req.dbClient;
    const dbColUsers = req.dbCol; // "users"
    const dbColPCComponents = req.dbCol2; // "pccomponents"

    // Find correct user making the request
    const findUser = await dbColUsers.findOne({ username: username });
    if (!findUser) {
      client.close();
      return res
        .status(403)
        .json({ error: "Åtkomst nekad! (Ingen användare)" });
    }
    // Then check if they are authorized to continue the request
    if (!findUser.roles.includes("put_components")) {
      client.close();
      return res
        .status(403)
        .json({ error: "Åtkomst nekad! (Rollen ej tilldelad)" });
    }

    // Check if user also is allowed to get images when data is returned!
    let includeImgFiles = true;
    if (!findUser.roles.includes("put_images")) {
      includeImgFiles = false;
    }
    // Grab PCComponent and filter out based on get_images access:
    const findSingleComponent = await dbColPCComponents.findOne({
      componentid: validID,
    });

    // PCComponent with /:id doesn't exist
    if (!findSingleComponent) {
      client.close();
      return res.status(404).json({
        error: `Datorkomponenten med id:${validID} finns inte!`,
      });
    }

    // When it exists, return it filtered with images or without
    filterData = {
      componentid: findSingleComponent.componentid,
      componentName: findSingleComponent.componentName,
      componentDescription: findSingleComponent.componentDescription,
      componentPrice: findSingleComponent.componentPrice,
      componentAmount: findSingleComponent.componentAmount,
      componentStatus: findSingleComponent.componentStatus,
      componentCategories: findSingleComponent.componentCategories,
      componentImages: includeImgFiles
        ? findSingleComponent.componentImages
        : "",
    };

    // Finally return the single filtered PC Component!
    client.close();
    return res.status(200).json({
      success: "Datorkomponent hämtad!",
      data: filterData,
    });
  } catch (e) {
    client.close();
    return res
      .status(500)
      .json({ error: "Databasfel. Kontakta Systemadministratören!" });
  }
};

// DELETE /api/pccomponents/:id
const deleteSinglePCcomponent = async (req, res) => {
  // Check for authData req object's existence first
  if (!req.authData || !req.authData?.username) {
    return res.status(403).json({ error: "Åtkomst nekad!" });
  }
  // Grab integer from `req.params`
  const validID = parseInt(req.params.id);

  // Then grab username to check against in database
  const username = req.authData.username;
  // Init MongoDB
  let client;
  try {
    // Then grab maka2207 database and its collections:
    client = req.dbClient;
    const dbColUsers = req.dbCol; // "users"
    const dbColPCComponents = req.dbCol2; // "pccomponents"

    // Find correct user making the request
    const findUser = await dbColUsers.findOne({ username: username });
    if (!findUser) {
      client.close();
      return res
        .status(403)
        .json({ error: "Åtkomst nekad! (Ingen användare)" });
    }
    // Then check if they are authorized to continue the request
    if (!findUser.roles.includes("delete_components")) {
      client.close();
      return res
        .status(403)
        .json({ error: "Åtkomst nekad! (Rollen ej tilldelad)" });
    }
    // Check if PCComponent first exists
    const findSingleComponent = await dbColPCComponents.findOne({
      componentid: validID,
    });

    // PCComponent with /:id doesn't exist
    if (!findSingleComponent) {
      client.close();
      return res.status(404).json({
        error: `Datorkomponenten med id:${validID} finns inte!`,
      });
    }

    // If it exists then try delete it
    const deleteSingleComponent = await dbColPCComponents.deleteOne({
      componentid: validID,
    });

    if (deleteSingleComponent.deletedCount === 1) {
      client.close();
      return res.status(200).json({
        success: `Datorkomponenten med id:${validID} raderad!`,
      });
      // When failed
    } else {
      client.close();
      return res.status(404).json({
        error: `Datorkomponenten med id:${validID} finns inte!`,
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
  getAllPCcomponents,
  getSinglePCcomponent,
  putSinglePCcomponent,
  postSinglePCcomponent,
  deleteSinglePCcomponent,
};
