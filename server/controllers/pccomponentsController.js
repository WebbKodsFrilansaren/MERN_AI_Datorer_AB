require("dotenv").config();
const { existsSync } = require("fs");
const fs = require("fs/promises");

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
  // Check for authData req object's existence first
  if (!req.authData || !req.authData?.username) {
    return res.status(403).json({ error: "Åtkomst nekad!" });
  }

  // Then grab username to check against in database
  const username = req.authData.username;
  // Init MongoDB
  let client;
  let nextComponentId = 1;
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
    if (!findUser.roles.includes("post_components")) {
      client.close();
      return res
        .status(403)
        .json({ error: "Åtkomst nekad! (Rollen ej tilldelad)" });
    }

    // Check if user also is allowed to post images when uploading new component!
    let includeImgFiles = true;
    if (!findUser.roles.includes("post_images")) {
      includeImgFiles = false; // False, so even if images were sent they will be ignored
    }

    // Find highest current value of `componentid` by sorting it from max value and just
    const highestComponentId = await dbColPCComponents
      .find()
      .sort({ componentid: -1 })
      .limit(1)
      .next();

    // If DOES exist then nextComponentId is that plus one, otherwise it's first component!
    if (highestComponentId) {
      nextComponentId = highestComponentId.componentid + 1;
    }

    // Handle possible images uploaded
    let imgArray = [];
    const imgPath = process.cwd() + "\\server\\images\\" + nextComponentId;

    // if = files exist AND user is allowed to post them!
    if (req.files !== undefined && includeImgFiles) {
      let counter = 1;
      // Create folder /:componentid/ if it doesn't exist
      if (!existsSync(imgPath)) fs.mkdir(imgPath);

      // Then loop through each file and move those who are valid image files
      req.files.forEach((file) => {
        // Remove invalid files (not image/* mimetypes!)
        if (!file.mimetype.includes("image")) {
          fs.unlink(file.path);
        } // WHEN CORRECT FILE TYPES: Rename valid files, add to imgArray[], and then move them to folder `imgPath`
        else {
          const lastDotInFileName = file.originalname.lastIndexOf(".");
          const fileNameWithOutDot = file.originalname.slice(
            0,
            lastDotInFileName
          );
          fs.rename(
            file.path,
            imgPath +
              "\\" +
              fileNameWithOutDot +
              "-" +
              counter +
              file.originalname.slice(lastDotInFileName)
          );
          imgArray.push(
            fileNameWithOutDot +
              "-" +
              counter +
              file.originalname.slice(lastDotInFileName)
          );
          counter++;
        }
      });
    } // else if = files sent but user not allowed to post them
    else if (req.files !== undefined && !includeImgFiles) {
      req.files.forEach((file) => fs.unlink(file.path));
    }

    // Finalize component to insert in DB
    const postNewComponent = {
      componentid: nextComponentId,
      componentName: req.body.componentname,
      componentDescription: req.body.componentdescription,
      componentPrice: parseInt(req.body.componentprice),
      componentAmount: parseInt(req.body.componentamount),
      componentStatus:
        req.body.componentstatus.toLowerCase() === "true" ? "Ny" : "Begagnad",
      componentCategories: req.body.componentcategories,
      componentImages: includeImgFiles ? imgArray : "",
    };

    // Try inserting new component now finally - with or without images!
    const tryPostComponent = await dbColPCComponents.insertOne(
      postNewComponent
    );

    // if = succeeded inserting new component | else = failed trying it
    if (tryPostComponent) {
      client.close();
      return res.status(200).json({ success: "Komponenten har lagts till!" });
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

    // Grab PCComponent and filter out based on get_images access:
    const findSingleComponent = await dbColPCComponents.findOne({
      componentid: validID,
    });

    // PCComponent with /:id doesn't exist
    if (!findSingleComponent) {
      client.close();
      return res.status(404).json({
        error: `Komponenten med id:${validID} finns inte!`,
      });
    }

    // When it exists, first prepare it
    const updateComponent = {
      componentName: req.body.componentname,
      componentDescription: req.body.componentdescription,
      componentPrice: req.body.componentprice,
      componentAmount: req.body.componentamount,
      componentStatus: req.body.componentstatus ? "Ny" : "Begagnad",
      componentCategories: req.body.componentcategories,
    };

    // Then, try updating it
    const tryUpdateComponent = await dbColPCComponents.updateOne(
      { componentid: validID },
      { $set: updateComponent }
    );

    // If = failed updating component | Else = succeeded updating component
    if (!tryUpdateComponent) {
      client.close();
      return res
        .status(500)
        .json({ error: "Misslyckades att uppdatera komponenten!" });
    } else {
      client.close();
      return res.status(200).json({ success: "Komponenten har uppdaterats!" });
    }
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
