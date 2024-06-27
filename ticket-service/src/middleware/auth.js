import jwt from "jsonwebtoken";
import { User } from "../models/userSchema.js";

const isLogin = async (req, res, next) => {
  try {
    const token = req.session.jwt;

    if (!token) {
      return res.status(401).json({ error: { message: "Unauthorized" } });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      return res.status(401).json({ error: { message: "Unauthorized" } });
    }

    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ error: { message: "Unauthorized" } });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Error in isLogin middleware:", error.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export default isLogin;
