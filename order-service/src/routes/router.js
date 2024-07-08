import { Router } from "express";
import { body, validationResult } from "express-validator";
import isLogin from "../middleware/auth.js";

import { createOrder, cancelOrder, viewAllOrders } from "../controllers/controller.js";

const router = Router();

router.post("/api/orders/create", [
  body("ticketId").not().isEmpty().withMessage("Ticket ID is mandatory!!!"),
  isLogin,
  createOrder,
]);

router.post("/api/orders/:id", isLogin, cancelOrder);

router.get("/api/orders/getAll", isLogin, viewAllOrders);

export default router;
