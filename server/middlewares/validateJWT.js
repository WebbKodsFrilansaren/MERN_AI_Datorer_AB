require("dotenv").config();
// Now we need MongoClient from mongodb npm package and...
const { MongoClient } = require("mongodb");
const dbURL = process.env.MONGO_URL;

// Secret keys
const ACCESS_TOKEN = process.env.ACCESS_TOKEN;
const REFRESH_TOKEN = process.env.REFRESH_TOKEN;

// brcypt=check encrypted passwords, cookie=parse httpOnly cookies, jwt=JWT management
const bcrypt = require("bcrypt");
const cookie = require("cookie-parser");
const jwt = require("jsonwebtoken");

// FIND CORRECT USERNAME and THEIR encrypted_access_token
const test = await dbColUsers.findOne({
  username: correctUser.username,
});
