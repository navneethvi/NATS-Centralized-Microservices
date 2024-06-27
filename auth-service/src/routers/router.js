// routes/userRoutes.js
import { Router } from "express";
import {
  getCurrentUser,
  signInUser,
  signOutUser,
  signUpUser,
} from "../controllers/controller.js";

import { body } from "express-validator";

import isLogin from "../middleware/auth.js";

const router = Router();

router.get("/api/users/currentuser",isLogin, getCurrentUser);
router.post(
  "/api/users/signup",
  [
    body("email").isEmail().withMessage("Email must be valid"),
    body("password")
      .trim()
      .isLength({ min: 4, max: 8 })
      .withMessage("Password must be between 4 and 8 characters"),
  ],
  signUpUser
);
router.post(
  "/api/users/signin",
  [
    body("email").isEmail().withMessage("Email must be valid"),
    body("password")
      .trim()
      .isLength({ min: 4, max: 8 })
      .withMessage("Password must be between 4 and 8 characters"),
  ],
  signInUser
);

router.post("/api/users/signout",isLogin, signOutUser)

export default router;
