import { verifyToken } from "../util/jwt.js";

const isLogin = async (req, res, next) => {

  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: "Unauthorized", error: "No token provided" });
  }

  const token = authHeader.split(" ")[1]; 

  if (!token) {
    return res.status(401).json({ message: "Unauthorized", error: "Invalid token format" });
  }

  try {
    const decoded = verifyToken(token);
    req.user = decoded; 
    next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized", error: error.message });
  }
};

export default isLogin;
