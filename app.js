const express = require("express");
const compression = require("compression");
const mongoose = require("mongoose");
const helmet = require("helmet");
var logger = require("morgan");

const dotenv = require("dotenv");
dotenv.config();

const cookieParser = require("cookie-parser");

const siteRouter = require("./routes");

const app = express();
const port = process.env.PORT || 5000;

app.set("view engine", "ejs");

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(cookieParser());

app.use(compression());
app.use(helmet.frameguard({ action: "SAMEORIGIN" }));

const morganLogStyle = app.get("env") === "development" ? "dev" : "common";
app.use(logger(morganLogStyle));

// --------- Routes -------

app.use("/", siteRouter);

//TODO: change db password
mongoose.connect(
  `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_NAME}-2cvre.mongodb.net/arsonSauce?retryWrites=true&w=majority`,
  { useNewUrlParser: true, useUnifiedTopology: true }
);

app.listen(port, () => {
  console.log(`Server running on ${port}`);
});
