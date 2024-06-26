const errorHandler = (err, req, res, next) => {
  console.log("Error:", err.message); // Log the error message for debugging
  if (err.type) {
    res.status(err.statusCode).send({
      errors: err.reasons,
    });
  } else {
    res
      .status(400)
      .send({ errors: { reasons: [{ message: "An error occurred" }] } });
  }
};

export default errorHandler;
