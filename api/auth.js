const jwt = require("jsonwebtoken");
const { jwtsecret } = require("./config");

module.exports = function (req, res, next) {
  // Get token from header
  const token = req.header("x-auth-token");

  // Check if not token
  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  // Verify token
  try {
    jwt.verify(token, jwtsecret, (error, decoded) => {
      if (error) return res.status(401).json({ message: "Token is not valid" });
      else next();
    });
  } catch (err) {
    console.error("something wrong with auth middleware");
    res.status(500).json({ msg: "Server Error" });
  }
};
