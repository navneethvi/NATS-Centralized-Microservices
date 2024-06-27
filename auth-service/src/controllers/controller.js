import { validationResult } from "express-validator";

import { User } from "../models/userSchema.js";

import { securePassword, comparePassword } from "../utils/bcrypt.js";

import { createToken, verifyToken } from "../utils/jwt.js";

const COOKIE_OPTIONS = {
    httpOnly: true, 
    secure: process.env.NODE_ENV === 'production', 
    sameSite: 'strict', 
    maxAge: 24 * 60 * 60 * 1000 
  };

const getCurrentUser = async (req, res, next) => {
  try { 
    if(!req.session.jwt){
        return res.send({currentUser : null})
    }
    const payload = verifyToken(req.session.jwt)
    res.send({currentUser : payload})
    
  } catch (error) {
    console.log(error.message);
    next(error)
  }
};

const signUpUser = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      let error = new Error("Validation failed");
      error.type = "RequestValidation";
      error.statusCode = 400;
      error.reasons = errors.array().map((error) => {
        return { message: error.msg, field: error.path };
      });
      throw error;
    }
    const { email, password } = req.body;
    console.log(email, password);
    console.log("Creating a user....");
    const userExists = await User.findOne({ email });
    if (userExists) {
      console.log("User already exists");
      const error = new Error("Account Exist");
      error.type = "BadRequest";
      error.statusCode = 400;
      error.reasons = [{ message: "Account already exists !!" }];
      throw error;
    } else {
      const hashedPass = await securePassword(password);
      const createdUser = await User.create({
        email: email,
        password: hashedPass,
      });
      if (createdUser) {
        const userToken = await createToken(createdUser);
        console.log("Token generated: ", userToken);
        req.session = {jwt: userToken}
        res.send({
          user: { id: createdUser._id, email: createdUser.email },
          userToken,
        });
      }
    }
  } catch (error) {
    console.log(error.message);
    next(error);
  }
};
const signInUser = async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        let error = new Error("Validation failed");
        error.type = "RequestValidation";
        error.statusCode = 400;
        error.reasons = errors.array().map((error) => {
          return { message: error.msg, field: error.param };
        });
        throw error;
      }
  
      const { email, password } = req.body;
      const userExist = await User.findOne({ email });
  
      if (!userExist) {
        const error = new Error("Invalid Credentials");
        error.type = "BadRequest";
        error.statusCode = 400;
        throw error;
      }
  
      const passwordMatch = await comparePassword(password, userExist.password);
  
      if (!passwordMatch) {
        const error = new Error("Invalid Password");
        error.type = "BadRequest";
        error.statusCode = 400;
        throw error;
      }

  
      const userToken = await createToken(userExist);
      console.log("Token generated: ", userToken);

      req.session.jwt = userToken
      console.log("session", req.session);
      res.status(200).json({
        user: { id: userExist._id, email: userExist.email },
        userToken,
      });
  
    } catch (error) {
      console.error("Error in signInUser:", error.message);
      next(error);
    }
  };
const signOutUser = async (req, res, next) => {
  try {
    req.session.destroy((err) => {
        if (err) {
          console.error("Error destroying session:", err.message);
          return next(err);
        }
        res.clearCookie('session-id'); 
        res.send({});
      });
  } catch (error) {
    console.log(error.message);
    next(error)
  }
};

export { getCurrentUser, signInUser, signOutUser, signUpUser };
