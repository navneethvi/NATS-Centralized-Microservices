import jwt from "jsonwebtoken";
import { createHash } from "crypto";

const createToken = async (user) => {
    try {
        const secret = process.env.JWT_SECRET
        const token = jwt.sign({id : user._id, email : user.email}, secret, {
            expiresIn: "15m"
        })
        return token
    } catch (error) {
        console.log(error.message);
    }
};

const verifyToken = (token) => {
    try {
        const secret = process.env.JWT_SECRET;
        const decoded = jwt.verify(token, secret);
        return decoded; 
    } catch (error) {
        console.log(error.message);
        return null;
    }
};

const inValidate = (token) => {
    const hash = createHash("sha256");
    hash.update(token);
    return hash.digest("hex");
  };

export {createToken, verifyToken, inValidate}