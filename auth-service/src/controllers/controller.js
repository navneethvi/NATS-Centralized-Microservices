import { validationResult } from "express-validator";

import { User } from "../models/userSchema.js";

import securePassword from "../../utils/bcrypt.js";

import { createToken } from "../../utils/jwt.js";

const getCurrentUser = async (req, res) => {
  try {
    return res.send({ currentUser: req.user || "no user found" });
  } catch (error) {
    console.log(error.message);
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
        const hashedPass = await securePassword(password)
        const createdUser = await User.create({email: email, password: hashedPass})
        if(createdUser){
            const userToken = await createToken(createdUser)
            console.log("Token generated: ",userToken);
            res.send({
                user: {id : createdUser._id, email : createdUser.email}, userToken
            })
        }
    }
  } catch (error) {
    console.log(error.message);
    next(error);
  }
};

const signInUser = async (req, res) => {
  try {
  } catch (error) {
    console.log(error.message);
  }
};

const signOutUser = async (req, res) => {
  try {
  } catch (error) {
    console.log(error.message);
  }
};

export { getCurrentUser, signInUser, signOutUser, signUpUser };
