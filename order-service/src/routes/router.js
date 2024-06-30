import { Router } from "express";
import { body, validationResult } from "express-validator";
import isLogin from "../middleware/auth.js";

import { createOrder } from "../controllers/controller.js";

const router = Router();

router.post("/api/orders/create", [
  body("ticketId").not().isEmpty().withMessage("Ticket ID is mandatory!!!"),
  isLogin,
  createOrder,
]);

export default router;
