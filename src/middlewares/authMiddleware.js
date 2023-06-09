const jwt = require("jsonwebtoken");
const httpStatus = require("http-status");

const authMiddleware = (req, res, next) => {
  const auth = req.header("Authorization");

  if (!auth) {
    return res.status(httpStatus.UNAUTHORIZED).json({ error: "Access denied" });
  }

  try {
    const token = auth.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user;
    next();
  } catch (error) {
    res
      .status(httpStatus.UNAUTHORIZED)
      .json({ 
        status: httpStatus.UNAUTHORIZED, 
        message: httpStatus["401_NAME"]
      });
  }
};

module.exports = authMiddleware;
