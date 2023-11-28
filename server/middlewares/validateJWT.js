require("dotenv").config();
// Now we need MongoClient from mongodb npm package and...
const { MongoClient } = require("mongodb");
const dbURL = process.env.MONGO_URL;
const bcrypt = require("bcrypt"); // ...bcrypt to check stored password
const jwt = require("jsonwebtoken"); // ...and JSON Web Token to sign a newly created JWT!
const { encrypt, decrypt } = require("../helpers/de_encrypt"); // ...and encrypt helper function!

// FIND CORRECT USERNAME and THEIR encrypted_access_token
const test = await dbColUsers.findOne({
  username: correctUser.username,
});
console.log(test.encrypted_access_token);

// Grab its encrypted part and buffer part
const crypted = test.encrypted_access_token[0];
const buffer = test.encrypted_access_token[1];
// Decrypt by converting its Base64 back to a Buffer Array value!
const decrypted = decrypt(crypted, Buffer.from(buffer.buffer));
