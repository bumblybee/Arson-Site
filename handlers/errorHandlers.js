const { logger } = require("../handlers/logger");

exports.catchErrors = (fn) => {
  return function (req, res, next) {
    return fn(req, res, next).catch(next);
  };
};

exports.developmentErrors = (err, req, res, next) => {
  err.stack = err.stack || "";
  const errorDetails = {
    error: err.message,
    stack: err.stack,
  };

  logger.error(err);
  res.status(err.status || 500).json(errorDetails);
};

exports.productionErrors = (err, req, res, next) => {
  logger.error(err);
  res.status(err.status || 500).json({
    error: err.message,
  });
};

exports.jwtError = (err, req, res, next) => {
  logger.error(err);
  if (err.name === "UnauthorizedError") {
    res.status(401).render("error/error", { code: err.code });
  }
};

class CustomError extends Error {
  constructor(error, name, status) {
    super(error);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, CustomError);
    }

    this.name = name;
    this.status = status;
  }
}

exports.CustomError = CustomError;
