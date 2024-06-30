import Order from "../models/orderSchema.js";
import Ticket from "../models/ticketSchema.js";
import { validationResult } from "express-validator";

import OrderCreatedPublisher from "../nats/publishers/OrderCreatedPublisher.js";

import natsWrapper from "../nats/nats-client.js";

const createOrder = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      let error = new Error();
      error.type = "RequestValidation";
      error.statusCode = 400;
      error.reasons = errors.array().map((error) => {
        return { message: error.msg, field: error.path };
      });
      throw error;
    }
    const { ticketId } = req.body;
    const ticket = await Ticket.findById(ticketId);
    if (!ticket) {
      const error = new Error();
      error.type = "NotFound";
      error.statusCode = 404;
      error.reasons = [{ message: "Ticket not found!!" }];
      throw error;
    }
    const existingOrder = await Order.findOne({
      ticket: ticket._id,
      status: { $in: ["Created", "AwaitingPayment", "Completed"] },
    });
    if (existingOrder) {
      const error = new Error();
      error.type = "BadRequest";
      error.statusCode = 400;
      error.reasons = [{ message: "Ticket reserved!!" }];
      throw error;
    }

    const expiration = new Date();
    expiration.setSeconds(expiration.getSeconds() + 15 * 60);

    const order = await Order.create({
      userId: req.user.id,
      status: "Created",
      expiresAt: expiration,
      ticket: ticket._id,
    });

    await new OrderCreatedPublisher(natsWrapper.getClient()).publish({
      id: order._id,
      status: order.status,
      userId: order.userId,
      expiresAt: order.expiresAt.toISOString(),
      ticket: {
        id: ticket._id,
        title: ticket.title,
        price: ticket.price,
      },
      version: order.version,
    });

    res.status(201).send({
      id: order.id,
      status: order.status,
      userId: order.userId,
      expiresAt: order.expiresAt,
      ticket: {
        id: ticket._id,
        title: ticket.title,
        price: ticket.price,
      },
    });
  } catch (error) {
    console.log(error.message);
    next(error);
  }
};

export { createOrder };
