import { Ticket } from "../models/ticketSchema.js";
import { body, validationResult } from "express-validator";
import TicketCreatedPublisher from "../nats/publishers/TicketCreatedPublisher.js";
import TicketUpdatedPublisher from "../nats/publishers/TicketUpdatedPublisher.js";
import NatsWrapper from "../nats/nats-client.js";
import CustomError from "../middleware/customError.js";

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
    res.status(200).send(ticketOrg);
  } catch (error) {
    console.log(error.message);
    next(error);
  }
};

const updateTicket = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error("Validation failed");
      error.type = "RequestValidation";
      error.statusCode = 400;
      error.reasons = errors.array().map((error) => ({
        message: error.msg,
        field: error.path,
      }));
      throw error;
    }

    const { title, price } = req.body;
    const { id } = req.params;

    const ticket = await Ticket.findById(id);

    if (!ticket) {
      const error = new Error("Ticket not found");
      error.type = "NotFound";
      error.statusCode = 404;
      throw error;
    }

    if (ticket.userId !== req.user.id) {
      const error = new Error(
        "Unauthorized: Only the owner can update the ticket"
      );
      error.type = "Authorization";
      error.statusCode = 403;
      throw error;
    }

    ticket.title = title;
    ticket.price = price;
    await ticket.save();

    await new TicketUpdatedPublisher(NatsWrapper.getClient()).publish({
      id: ticket._id,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId,
      version: ticket.version,
    });

    const ticketOrg = {
      id: ticket.id,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.price,
    };

    console.log("Ticket updated:", ticket);
    res.status(200).send(ticketOrg);
  } catch (error) {
    console.error("Error updating ticket:", error.message);
    next(error);
  }
};

const viewTicket = async (req, res, next) => {
  try {
    const { id } = req.params;
    console.log(id);
    const ticket = await Ticket.findById(id);
    if (!ticket) {
      let error = new Error("Ticket Not Found!");
      error.type = "NotFound";
      error.statusCode = 404;
      error.reasons = [{ message: "Ticket Not Found!" }];
      throw error;
    }
    const ticketOrg = {
      id: ticket._id,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId,
    };
    res.status(200).send(ticketOrg);
  } catch (error) {
    console.log(error.message);
    next(error);
  }
};


const viewAllTicket = async (req, res, next) => {
  try {
    const tickets = await Ticket.find({})

    console.log("tickets ",tickets);
    const ticketArray = tickets.map((ticket)=>{
      return{
        id : ticket._id,
        title : ticket.title,
        price: ticket.price,
        userId: ticket.userId,
        orderId : ticket.orderId
      }
    })
    res.status(200).send(ticketArray)
  } catch (error) {
    console.error("Error fetching tickets:", error.message);
    next(error)
  }
}

export { createTicket, updateTicket, viewTicket, viewAllTicket };
