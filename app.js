const express = require("express");
const compression = require("compression");
const mongoose = require("mongoose");

const siteRouter = require("./routes");

const app = express();
const port = process.env.PORT || 3000;

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(compression());

app.use("/", siteRouter);

// --------------- MongoDB Code ------------------
// mongo "mongodb+srv://arson-sauce-2cvre.mongodb.net/arsonSauce" --username admin-tiffani

//TODO: change db password
mongoose.connect(
  `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_NAME}-2cvre.mongodb.net/arsonSauce?retryWrites=true&w=majority`,
  { useNewUrlParser: true, useUnifiedTopology: true }
);

app.listen(port, () => {
  console.log(`Server running on ${port}`);
});
