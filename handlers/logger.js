const winston = require("winston");
const path = require("path");

const logger = winston.createLogger({
  format: winston.format.combine(
    winston.format.timestamp({ format: "YYY-MM-DD HH:mm:ss" }),
    winston.format.prettyPrint(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),

  transports: [
    new winston.transports.File({
      filename: path.join(__dirname, "../logs/error.log"),
      level: "error",
    }),
    new winston.transports.File({
      filename: path.join(__dirname, "../logs/general.log"),
    }),
  ],
  rejectionHandlers: [
    new winston.transports.File({
      filename: path.join(__dirname, "../logs/rejections.log"),
    }),
  ],
  exceptionHandlers: [
    new winston.transports.File({
      filename: path.join(__dirname, "../logs/exceptions.log"),
    }),
  ],
});

if (process.env.Node_ENV !== "production") {
  logger.add(
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    })
  );
}

winston.addColors({ error: "red", info: "cyan", warn: "yellow" });

logger.on("error", function (err) {
  logger.error(err);
  return;
});

exports.logger = logger;
