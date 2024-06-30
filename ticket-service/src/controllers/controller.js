import { Ticket } from "../models/ticketSchema.js";
import { body, validationResult } from "express-validator";
import TicketCreatedPublisher from "../nats/publishers/TicketCreatedPublisher.js";
import NatsWrapper from "../nats/nats-client.js";
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
      title: title,
      price: price,
      userId: req.user.id,
    });

    await new TicketCreatedPublisher(NatsWrapper.getClient()).publish({
      id: newTicket._id,
      title: newTicket.title,
      price: newTicket.price,
      userId: newTicket.userId,
      version: newTicket.version,
    });
    const ticketOrg = {
      id: newTicket._id,
      title: newTicket.title,
      price: newTicket.price,
      userId: newTicket.userId,
    };
    console.log("Ticket created...");
    res.status(200).send(ticketOrg)
  } catch (error) {
    console.log(error.message);
    next(error);
  }
};

export { createTicket };
