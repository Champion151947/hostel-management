import jwt from "jsonwebtoken";
import Admin from "../models/Admin.js";
import Student from "../models/Student.js";

const JWT_SECRET = "hostel_management_secret_key_2025";

export const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, JWT_SECRET);
      req.admin = await Admin.findById(decoded.id).select("-password");
      if (!req.admin) {
        req.user = await Student.findById(decoded.id).select("-password");
      }
      if (req.admin || req.user) {
        next();
        return;
      }
      return res.status(401).json({ message: "Not authorized, user not found" });
    } catch {
      return res.status(401).json({ message: "Not authorized, invalid token" });
    }
  }
  return res.status(401).json({ message: "Not authorized, no token" });
};

export const adminOnly = async (req, res, next) => {
  if (!req.admin) return res.status(403).json({ message: "Admin access required" });
  next();
};

export { JWT_SECRET };
