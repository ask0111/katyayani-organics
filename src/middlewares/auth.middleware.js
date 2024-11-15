const { verifyToken } = require("../utils/jwt");

const protect = (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  try {
    const decoded = verifyToken(token);
    req.user = decoded; 
    next();
  } catch (error) {
    res.status(400).json({ message: "Invalid token" });
  }
};

const isAdmin = (req, res, next) => {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }
    next();
  };

module.exports = { protect, isAdmin };
