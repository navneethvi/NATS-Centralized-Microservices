import express from "express";

import router from "./routes/router.js";
import errorHandler from "./middleware/errorhandler.js";
import mongoose from "mongoose";
import session from "express-session";

import natsWrapper from "./nats/nats-client.js";

import TicketCreatedListener from "./nats/listeners/TicketCreatedListener.js";
import TicketUpdatedListener from "./nats/listeners/TicketUpdatedListener.js";

const app = express();

app.use(express.json());


app.use(router);

app.all("*", async (req, res, next) => {
  try {
    let error = new Error();
    error.type = "NotFound";
    error.statusCode = 404;
    error.reasons = [{ message: "Not Found" }];
    throw error;
  } catch (err) {
    next(err);
  }
});

app.use(errorHandler);  
    
const connectDB = async () => {
  if (process.env.JWT_KEY) {
    throw new Error("JWT_KEY must be defined");
  }
  try {
    console.log(process.env.MONGO_URI);
    await natsWrapper.connect("ticketing", "123", "http://nats-svc:4222");
    natsWrapper.getClient().on("close", () => {
      console.log("NATS connection closed!");
      process.exit();
    });

    process.on('SIGINT',()=> natsWrapper.getClient().close())
    process.on('SIGTERM',()=> natsWrapper.getClient().close())

    new TicketCreatedListener(natsWrapper.getClient()).listen();
    new TicketUpdatedListener(natsWrapper.getClient()).listen();


    await mongoose.connect("mongodb://order-mongo-svc:27017/order" || process.env.MONGO_URI);
    console.log("Database Connected");
  } catch (error) {
    console.log(error.message);
  }
};

connectDB();

app.listen(8002, () => { 
  console.log("Order Service Listening on 8002");
});
