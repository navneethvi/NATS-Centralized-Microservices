import { Router } from "express";
import { body, validationResult } from "express-validator";
import { createTicket } from "../controllers/controller.js";
import isLogin from "../middleware/auth.js";

const router = Router();

router.post(
  "/api/tickets/create",
  isLogin,
//   [body("title").not().isEmpty().withMessage("Title is required")],
  createTicket
);

export default router;
