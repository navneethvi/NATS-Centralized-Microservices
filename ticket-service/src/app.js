import express from "express";
import session from 'express-session'
import errorHandler from "./middleware/errorhandler.js";
import mongoose from "mongoose";
import router from "./routers/router.js";

const app = express();

app.use(express.json());

app.use(
  session({
    secret: process.env.SESSION_SECRET || "herllo",
    resave: false,
    saveUninitialized: false,
  })
);

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
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Database Connected");
  } catch (error) {
    console.log(error.message);
  }
};

connectDB();

app.listen(8001, () => {
  console.log("Ticket Service Listening on 8001!!!");
});
