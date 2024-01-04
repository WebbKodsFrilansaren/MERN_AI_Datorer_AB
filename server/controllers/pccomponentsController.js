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
    // Grab PCComponents and filter out based on get_images access:
    const returnPCComponentsData = await dbColPCComponents.find().toArray();
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
  return res.status(200).json({ success: "GET Single PCComponent!" });
};

// POST /api/pccomponents
const postSinglePCcomponent = async (req, res) => {
  return res.status(200).json({ success: "POST Single PCComponent!" });
};

// PUT /api/pccomponents/:id
const putSinglePCcomponent = async (req, res) => {
  return res.status(200).json({ success: "PUT Single PCComponent!" });
};

// DELETE /api/pccomponents/:id
const deleteSinglePCcomponent = async (req, res) => {
  return res.status(200).json({ success: "DELETE Single PCComponent!" });
};

// Export CRUDs for use!
module.exports = {
  getAllPCcomponents,
  getSinglePCcomponent,
  putSinglePCcomponent,
  postSinglePCcomponent,
  deleteSinglePCcomponent,
};
