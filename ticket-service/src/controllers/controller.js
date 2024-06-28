import { Ticket } from "../models/ticketSchema.js";
import { body, validationResult } from "express-validator";

const createTicket = async (req, res, next) => {
  try {
    console.log("create", req.body);
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
    const { title, price } = req.body;
    const newTicket = await Ticket.create({
        title : title,
        price : price,
        userId : req.user.id
    })
    console.log("Ticket created...");
    console.log(newTicket);
  } catch (error) {
    console.log(error.message);
    next(error);
  }
};

export { createTicket };
