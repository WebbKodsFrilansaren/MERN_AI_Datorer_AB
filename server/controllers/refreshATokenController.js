require("dotenv").config();
// Secret Refresh Token Key
const refreshKey = process.env.REFRESH_TOKEN;

// logoutController function to logout, used by "POST api/logout"
const refreshAToken = async (req, res) => {
    
};

module.exports = { refreshAToken };
