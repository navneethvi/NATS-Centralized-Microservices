import { Router } from "express";
import { body, validationResult } from "express-validator";
import {
  createTicket,
  updateTicket,
  viewTicket,
  viewAllTicket,
} from "../controllers/controller.js";
import isLogin from "../middleware/auth.js";

const router = Router();

router.post(
  "/api/tickets/create",
  isLogin,
  [body("title").not().isEmpty().withMessage("Title is required")],
  createTicket
);

router.post(
  "/api/tickets/:id",
  isLogin,
  [body("title").not().isEmpty().withMessage("Title is required")],
  updateTicket
);

router.get("/api/tickets/getAll", viewAllTicket);

router.get("/api/tickets/:id", isLogin, viewTicket);

export default router;
