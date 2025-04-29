const errorHandler = (err, req, res, next) => {
  return res.status(err.status || err.response?.status || 500).json({
    message: err.message.toString() || "",
  });
};

module.exports = errorHandler;
