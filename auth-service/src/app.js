import express from "express";

import router from "./routers/router.js";
import errorHandler from "./middleware/errorhandler.js";

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

app.listen(8000, () => {
  console.log("Auth Service Listening on 8000!!!");
});
