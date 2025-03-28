require("dotenv").config();
const jwt = require("jsonwebtoken");
const { getById } = require("../models/user.model");

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token === null || token === undefined) {
    return res.status(401).json({ message: "Unauthorized: Missing token!" });
  }

  jwt.verify(token, process.env.SECRETORKEY, async (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Unauthorized: Invalid token!" });
    }
    try {
      const user = await getById(decoded.id);
      if (!user) {
        return res
          .status(403)
          .json({ message: "Unauthorized: User not found!" });
      }

      req.user = decoded;
      next();
    } catch (error) {
      console.error(
        "An error occurred during the authorization proccess:",
        error
      );
      return res.status(500).json({
        message: "An error occurred during the authorization proccess!",
      });
    }
  });
};

const isPriviledged = async (req, res, next) => {
  const { role } = req.user;
  if (role != "admin") {
    return res.status(403).json({
      message: "Only priviledged users are allowed to access this resource!",
    });
  } else {
    next();
  }
};

module.exports = { authMiddleware, isPriviledged };
