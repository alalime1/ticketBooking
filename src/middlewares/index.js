const errorHandler = require("./error-middleware");
const authenticate = require("./auth-middleware");

module.exports = {
  errorHandler,
  authenticate,
};
