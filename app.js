const express = require("express");
const mongoose = require("mongoose");
const nodemailer = require("nodemailer");
const mailgun = require("nodemailer-mailgun-transport");
const fs = require("fs");
const app = express();
const port = process.env.PORT || 3000;

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(express.json());

// --------------- MongoDB Code ------------------
// mongo "mongodb+srv://arson-sauce-2cvre.mongodb.net/arsonSauce" --username admin-tiffani

mongoose.connect(
  "mongodb+srv://admin-tiffani:fire3720@arson-sauce-2cvre.mongodb.net/arsonSauce?retryWrites=true&w=majority",
  { useNewUrlParser: true, useUnifiedTopology: true }
);

const recipeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Please add a title."],
  },
  date: {
    type: String,
    required: [true, "Please add a date."],
  },
  content: {
    type: String,
    required: [true, "Please enter content."],
  },
  submittedBy: String,
  img: {
    type: String,
    required: [true, "Please add an image file."],
  },
});

const newsSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Please add a title."],
  },
  date: {
    type: String,
    required: [true, "Please add a date."],
  },
  content: {
    type: String,
    required: [true, "Please add content."],
  },
  img: {
    type: String,
    required: [true, "Please add an image file."],
  },
});

const Recipe = mongoose.model("Recipe", recipeSchema);
const News = mongoose.model("News", newsSchema);

const newRecipe = new Recipe({
  title: "Fiesta Scramble",
  date: "06/2020",
  content: "Scrambled eggs and Fiesta cheese...",
  submittedBy: "Alan Gilbert",
  img: "img/sausage.jpg",
});

// newRecipe.save();

app.get("/", (req, res) => {
  res.render("home", { title: "Arson Sauce" });
});

app.get("/recipes", (req, res) => {
  Recipe.find({}, (err, recipes) => {
    if (err) throw err;
    // res.set("Content-Type", newRecipe.img.contentType);
    res.render("recipes", { recipes });
  });
});

app.get("/story", (req, res) => {
  res.render("story");
});

app.get("/news", (req, res) => {
  res.render("news");
});

//Get rid of sent and sendErr GET routes after design finished
app.get("/sent", (req, res) => {
  res.render("msgSent");
});

app.get("/error", (req, res) => {
  res.render("msgErr");
});

// Contact form submission
app.post("/sendEmail", (req, res) => {

  //Check if bot filled out form
  let bot;
  req.body.bot ? bot = "yes" : bot = "no";

  // Timeout for animation to run before posting
  setTimeout(() => {
    // Email body
    const emailText = `
  <h3>Details</h3>
  <ul>
  <li><strong>Bot:</strong> ${bot} </li>
  <li><strong>Name:</strong> ${req.body.name} </li>
  <li><strong>Email:</strong> ${req.body.email} </li>
  </ul>
  <br />
  <h3>Message</h3>
  <p>${req.body.msg}</p>
  `;

    // Mailgun auth
    const auth = {
      auth: {
        api_key: "1719ccda7e1284e05257b0f5c8f8c89f-a2b91229-115732bb",
        domain: "sandbox8c22f2f4bbff4cd3a3ccecb0bfb916cb.mailgun.org",
      },
    };

    // Create transporter through mailgun and pass auth
    const transporter = nodemailer.createTransport(mailgun(auth));

    // Email options
    const mailOptions = {
      from: `🌶 Arson Sauce Message ${req.body.email}`,
      to: "tiffaknee1@gmail.com",
      subject: "New Arson Sauce Form Submission",
      text: req.body.msg,
      html: emailText,
    };

    transporter.sendMail(mailOptions, (err, data) => {
      if (err) {
        console.log(err);
        res.render("msgErr");
      } else {
        console.log("Email sent");
        res.render("msgSent");
      }
    });
  }, 1800);
});

app.listen(port, () => {
  console.log(`Server running on ${port}`);
});
