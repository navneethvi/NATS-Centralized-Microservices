import Order from "../models/orderSchema.js";
import Ticket from "../models/ticketSchema.js";
import mongoose from "mongoose";

import {validationResult} from 'express-validator'

import OrderCreatedPublisher from "../nats/publishers/OrderCreatedPublisher.js";
import OrderCancelledPublisher from "../nats/publishers/OrderCancelledPublisher.js";

import natsWrapper from "../nats/nats-client.js";

const createOrder = async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const error = new Error('Request Validation Failed');
        error.type = "RequestValidation";
        error.statusCode = 400;
        error.reasons = errors.array().map(error => ({ message: error.msg, field: error.path }));
        throw error;
      }
  
      const { ticketId } = req.body;
      console.log(ticketId);
      const ticket = await Ticket.findById(ticketId);
      if (!ticket) {
        const error = new Error('Ticket not found');
        error.type = "NotFound";   
        error.statusCode = 404;
        error.reasons = [{ message: "Ticket not found!!" }];
        throw error;
      }
  
      const existingOrder = await Order.findOne({
        ticket: ticket._id,
        status: { $in: ["Created", "AwaitingPayment", "Completed"] },
      });
      console.log(existingOrder, "existeimh");
      if (existingOrder) {
        const error = new Error('Ticket already reserved');
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
        id: order._id,
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
      console.error(`Error creating order: ${error.message}`);
      next(error);
    }
  };
  
  const cancelOrder = async (req, res, next) => {
    try {
      const { id } = req.params;
      if (!mongoose.Types.ObjectId.isValid(id)) {
        const error = new Error('Invalid order ID');
        error.type = "BadRequest";
        error.statusCode = 400;
        error.reasons = [{ message: "Invalid order ID format" }];
        throw error;
      }
  
      const order = await Order.findById(id).populate("ticket");
      console.log(order, "cancel order order");
      if (!order) {
        const error = new Error('Order not found');
        error.type = "NotFound";
        error.statusCode = 404;
        error.reasons = [{ message: "Order not found!!" }];
        throw error;
      }
  
      if (order.userId !== req.user.id) {
        const error = new Error('Unauthorized access');
        error.type = "Unauthorized";
        error.statusCode = 403;
        error.reasons = [{ message: "Unauthorized" }];
        throw error;
      }
  
      order.set({ status: "Cancelled" });
      await order.save();
  
      await new OrderCancelledPublisher(natsWrapper.getClient()).publish({ 
        id: order._id,
        version: order.version,
        ticket: {
          id: order.ticket._id,
        },
      });
  
      res.status(200).send({
        id: order._id,
        status: order.status,
        userId: order.userId,
        expiresAt: order.expiresAt,
        ticket: {
          id: order.ticket._id,
          title: order.ticket.title,
          price: order.ticket.price,
        },
      });
    } catch (error) {
      console.error(`Error cancelling order: ${error.message}`);
      next(error);
    }
  };
  
  const viewAllOrders = async (req, res, next) => {
    try {
      const orders = await Order.find({ userId: req.user.id }).populate('ticket');
      console.log('User orders:', orders);
      res.status(200).send(orders);
    } catch (error) {
      console.error(`Error retrieving orders: ${error.message}`);
      next(error);
    }
  };
  

export { createOrder, cancelOrder, viewAllOrders };
