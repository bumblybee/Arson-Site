const express = require("express");
const compression = require("compression");
const errorHandlers = require("./handlers/errorHandlers");
const mongoose = require("mongoose");
const helmet = require("helmet");
var logger = require("morgan");

const dotenv = require("dotenv");
dotenv.config();

const cookieParser = require("cookie-parser");

const siteRouter = require("./routes");
const loginRouter = require("./routes/login");
const contactRouter = require("./routes/contact");
const notFoundRouter = require("./routes/notFound");

const app = express();
const port = process.env.PORT || 5000;

app.set("view engine", "ejs");

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(cookieParser());
app.use(compression());
app.use(helmet.frameguard({ action: "SAMEORIGIN" }));

// ----Logging----

const morganLogStyle = app.get("env") === "development" ? "dev" : "common";
app.use(logger(morganLogStyle));

// --------- Routes -------

app.use("/", siteRouter);
app.use("/login", loginRouter);
app.use("/contact", contactRouter);
app.use("/*", notFoundRouter);

// ------- Error Handling -------------
app.use(errorHandlers.jwtError);

if (app.get("env") === "development") {
  app.use(errorHandlers.developmentErrors);
} else {
  app.use(errorHandlers.productionErrors);
}

if (process.env.NODE_ENV === "development") {
  console.log("Working in dev environment");
}

if (process.env.NODE_ENV === "production") {
  console.log("Working in prod environment");
}

//TODO: change db password
mongoose.connect(
  `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_NAME}-2cvre.mongodb.net/arsonSauce?retryWrites=true&w=majority`,
  { useNewUrlParser: true, useUnifiedTopology: true }
);

app.listen(port, () => {
  console.log(`Server running on ${port}`);
});
