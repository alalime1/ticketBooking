const jwtLib = require("jsonwebtoken");

const generateToken = (id, role) => {
  return jwtLib.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: "7 days",
  });
};

const verifyToken = (token) => {
  try {
    const payload = jwtLib.verify(token, process.env.JWT_SECRET);
    return payload;
  } catch (error) {
    return null;
  }
};

module.exports = { generateToken, verifyToken };
