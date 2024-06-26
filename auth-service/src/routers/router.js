// routes/userRoutes.js
import { Router } from "express";
import {
  getCurrentUser,
  signInUser,
  signOutUser,
  signUpUser,
} from "../controllers/controller.js";

import { body } from "express-validator";

const router = Router();

router.get("/api/users/currentuser", getCurrentUser);
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

export default router;
