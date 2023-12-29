require("dotenv").config();
const bcrypt = require("bcrypt"); // ...bcrypt to encrypt password
const jwt = require("jsonwebtoken"); // ...and JSON Web Token to sign a newly created JWT!

// Secret keys needed when generating new user
const refreshKey = process.env.REFRESH_TOKEN;
const tokenKey = process.env.ACCESS_TOKEN;

const registerUser = async (req, res) => {};

// Export Controller for use!
module.exports = { registerUser };
