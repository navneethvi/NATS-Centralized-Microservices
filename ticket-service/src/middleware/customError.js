class CustomError extends Error {
    constructor(type, statusCode, message, reasons = []) {
      super(message);
      this.type = type;
      this.statusCode = statusCode;
      this.reasons = reasons;
    }
  
    static requestValidationError(errors) {
      return new CustomError(
        "RequestValidation",
        400,
        "Validation failed",
        errors.map((error) => ({ message: error.msg, field: error.path }))
      );
    }
  
    static notFoundError(message) {
      return new CustomError("NotFound", 404, message, [{ message }]);
    }
  
    static authorizationError(message) {
      return new CustomError("Authorization", 403, message, [{ message }]);
    }
  }
  
  export default CustomError;
  