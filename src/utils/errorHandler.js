const errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  return res.status(500).json({ message: "Internal server error" });
};

module.exports = errorHandler;
