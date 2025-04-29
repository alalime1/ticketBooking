const multer = require("multer");
const { randomHex } = require("../utils");

const multerConfig = {
  storage: multer.diskStorage({
    destination: "./public",
    filename: (req, file, cb) => {
      cb(null, randomHex(32) + "." + file.originalname.split(".").pop());
    },
  }),
};

module.exports = multerConfig;
