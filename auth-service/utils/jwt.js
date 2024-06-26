import jwt from "jsonwebtoken";
import { createHash } from "crypto";

const createToken = async (user) => {
    try {
        const secret = process.env.JWT_SECRET
        const token = await jwt.sign({id : user._id, email : user.email}, secret, {
            expiresIn: "10m"
        })
        return token
    } catch (error) {
        console.log(error.message);
    }
};

export {createToken}