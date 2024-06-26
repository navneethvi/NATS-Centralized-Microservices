import { validationResult } from "express-validator";

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
    console.log("Creating a user....");
    // throw new Error("DbConnectionError: Unable to connect to the user database");
    res.send({ message: "User created successfully" });
  } catch (error) {
    console.log(error.message);
    next(error)
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
