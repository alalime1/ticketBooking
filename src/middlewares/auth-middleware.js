const { jwt, HttpException } = require("../utils");

const authorization = { ADMIN: ["ADMIN"], USER: ["ADMIN", "USER"] };

const authenticate =
  (role = "USER") =>
  (req, res, next) => {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) return next(new HttpException(401, "Not Authorized, No Token"));

    const decoded = jwt.verifyToken(token);
    if (!decoded)
      return next(new HttpException(401, "Not Authorized, Invalid Token"));

    if (!authorization[role].includes(decoded.role))
      return next(new HttpException(403, "Forbidden"));

    req.user = decoded;

    next();
  };

module.exports = authenticate;
