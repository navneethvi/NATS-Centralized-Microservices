const errorHandler = (err, req, res, next) => {
  console.error("Error:", err.message); // Log the error for debugging

  if (err.type) {
    res.status(err.statusCode).send({
      errors: err.reasons,
    });
  } else {
    res.status(500).send({
      errors: [{ message: "An internal server error occurred" }],
    });
  }
};

export default errorHandler;
