const { Recipe, News, signIn } = require("../models");
const nodemailer = require("nodemailer");
const mailgun = require("nodemailer-mailgun-transport");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const dotenv = require("dotenv");
dotenv.config();

exports.getLogin = (req, res) => {
  res.render("login");
};

exports.loginUser = (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  signIn.findOne({ username: username }, (err, user) => {
    if (user) {
      bcrypt.compare(password, user.password, (err, result) => {
        if (err) throw err;
        if (result === true) {
          res.render("choosePostType");
        } else {
          res.redirect("/login");
        }
      });
    } else {
      res.redirect("/login");
    }
  });
};

exports.getHomeUpdates = async (req, res) => {
  let recipes = await Recipe.find().sort({ date: -1 });
  let news = await News.find().sort({ date: -1 });
  recipes = recipes.filter((recipe, index) => index < 2);
  news = news.filter((news, index) => index < 1)[0];

  res.render("home", { recipes, news });
};

exports.getStory = (req, res) => {
  res.render("story");
};

exports.getNews = (req, res) => {
  News.find({}, (err, posts) => {
    if (err) throw err;

    res.render("news", { posts });
  }).sort({ date: -1 });
};

exports.getNewsPost = (req, res) => {
  const postId = req.params.id;
  News.findOne({ _id: postId }, (err, post) => {
    if (err) throw err;
    if (post) {
      const title = post.title;
      const content1 = post.content1;
      const content2 = post.content2;
      const content3 = post.content3;
      const date = post.date;
      const images = post.images;

      res.render("newsPost", {
        title,
        content1,
        content2,
        content3,
        date,
        images,
      });
    } else {
      console.log("something went wrong");
    }
  });
};

exports.getRecipes = (req, res) => {
  Recipe.find({}, (err, recipes) => {
    if (err) throw err;
    // res.set("Content-Type", newRecipe.img.contentType);
    res.render("recipes", { recipes });
  }).sort({ date: -1 });
};

exports.getRecipe = (req, res) => {
  const recipeID = req.params.recipeID;

  Recipe.findOne({ _id: recipeID }, (err, recipe) => {
    if (err) throw err;
    if (recipe) {
      const title = recipe.title;
      const content1 = recipe.content1;
      const content2 = recipe.content2;
      const content3 = recipe.content3;
      const date = recipe.date;
      const submittedBy = recipe.submittedBy;
      const images = recipe.images;
      res.render("recipe", {
        title,
        content1,
        content2,
        content3,
        date,
        submittedBy,
        images,
      });
    } else {
      console.log("something went wrong");
    }
  });
};

exports.getComposeType = (req, res) => {
  const type = req.params.type;
  type === "news" ? res.render("composeNews") : res.render("composeRecipe");
};

exports.compose = (req, res) => {
  const type = req.params.type;
  if (type === "recipe") {
    const newRecipe = new Recipe({
      title: req.body.title,
      date: req.body.date,
      content1: req.body.content1,
      content2: req.body.content2,
      content3: req.body.content3,
      submittedBy: req.body.submittedBy,
      comment: req.body.comment,
      images: req.files,
    });
    // res.json(newRecipe.images);
    // console.log(req.files[0].filename);
    newRecipe.save();
    res.redirect("/recipes");
  } else if (type === "news") {
    const newPost = new News({
      title: req.body.title,
      date: req.body.date,
      content1: req.body.content1,
      content2: req.body.content2,
      content3: req.body.content3,
      submittedBy: req.body.submittedBy,
      comment: req.body.comment,
      images: req.files,
    });
    newPost.save();
    res.redirect("/news");
  }
};

exports.sendEmail = (req, res) => {
  //Check if bot filled out form
  let bot;
  req.body.bot ? (bot = "likely") : (bot = "unlikely");

  // Timeout for animation to run before posting
  setTimeout(() => {
    // Email body
    const emailText = `
  <h3>Details</h3>
  <ul>
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
        api_key: process.env.MAILGUN_KEY,
        domain: "sandbox8c22f2f4bbff4cd3a3ccecb0bfb916cb.mailgun.org",
      },
    };

    // Create transporter through mailgun and pass auth
    const transporter = nodemailer.createTransport(mailgun(auth));

    // Email options
    const mailOptions = {
      from: `🌶 Arson Sauce Message ${req.body.email}`,
      to: ["tiffaknee1@gmail.com", "arsonsauce@gmail.com"],
      subject: "New Arson Sauce Form Submission",
      text: req.body.msg,
      html: emailText,
    };

    if (bot === "unlikely") {
      transporter.sendMail(mailOptions, (err, data) => {
        if (err) {
          res.render("msgErr");
        } else {
          res.render("msgSent");
        }
      });
    } else {
      //Send confirmation even though not sent so they don't know it didn't go through
      res.render("msgSent");
    }
  }, 1600);
};
