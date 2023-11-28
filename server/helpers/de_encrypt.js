// "de_crypt.js" = Used to decrypt AND encrypt JWTs
const crypto = require("crypto");
require("dotenv").config({ path: "../../.env" }); // Load .env variables

// Grab stored "ENCRYPTION_KEY" in .env
const encryptionKey = process.env.ENCRYPTION_KEY;

// ENCRYPT = MAKE IT ENCRYPTED
function encrypt(text) {
  // Generate "iv" (=initalization vector) that will also be returned
  // since it is needed again to decrypt the encrypted part
  const iv = crypto.randomBytes(16);

  try {
    // Start encrypting
    const cipher = crypto.createCipheriv(
      "aes-256-cbc",
      Buffer.from(encryptionKey),
      iv
    );
    // Finalize the encrypted text
    let encrypted = cipher.update(text, "utf-8", "hex");
    encrypted += cipher.final("hex");

    // Return array which has encrypted data plus its
    // associated randomly generated IV (initalization vector)
    return [encrypted, iv];
  } catch (err) {
    // Just return null if it fails for some reason which can then be checked against!
    return null;
  }
}

// DECRYPT = MAKE IT DECRYPTED
// It also needs the previous initalization vector which is always new for each encrypted text
function decrypt(encrypted, iv) {
  // Start decrypting
  try {
    const decipher = crypto.createDecipheriv(
      "aes-256-cbc",
      Buffer.from(encryptionKey),
      iv
    );
    // Finalize the decrypted text
    let decrypted = decipher.update(encrypted, "hex", "utf-8");
    decrypted += decipher.final("utf-8");

    // Return the decrypted now as plain text string!
    return decrypted;
  } catch (err) {
    // Just return null if it fails for some reason which can then be checked against!
    return null;
  }
}

// Export functions as an object with them inside
module.exports = { encrypt, decrypt };
