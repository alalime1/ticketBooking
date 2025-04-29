const crypto = require("crypto");

function generateRandomHex(length) {
  return crypto.randomBytes(Math.ceil(length / 2)).toString("hex");
}

module.exports = generateRandomHex;
