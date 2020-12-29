const { Recipe, News, signIn } = require("../models");
const nodemailer = require("nodemailer");
const mailgun = require("nodemailer-mailgun-transport");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const emailHandler = require("../handlers/emailHandler");
const authService = require("../services/authService");
const COOKIE_CONFIG = require("../config/cookieConfig");

exports.getHome = async (req, res) => {
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

exports.getPricing = (req, res) => {
  //TODO: Add file upload POST
  const url = "https://arsonsauce.com/pdf/pricing.pdf";
  res.render("pricing", { url });
};

exports.getLogin = (req, res) => {
  res.render("auth/login");
};

exports.loginUser = async (req, res) => {
  const { username, password } = req.body;
  const { token, user } = await authService.loginWithPassword(
    username,
    password
  );

  if (token) res.cookie("jwt", token, COOKIE_CONFIG);

  if (user) {
    switch (req.body.btn) {
      case "create-news":
        res.render("auth/composeNews");
        break;

      case "create-recipe":
        res.render("auth/composeRecipe");
        break;

      case "edit-recipe":
        Recipe.find({}, (err, recipes) => {
          if (err) throw err;

          res.render("auth/editRecipeList", { recipes });
        }).sort({ date: -1 });
        break;

      case "edit-news":
        News.find({}, (err, posts) => {
          if (err) throw err;

          res.render("auth/editNewsList", { posts });
        }).sort({ date: -1 });
        break;
      default:
        res.redirect("/login");
    }
  } else {
    res.redirect("/login");
  }
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

exports.editForm = (req, res) => {
  const id = req.params.id;
  const type = req.params.type;
  if (type === "news") {
    News.findOne({ _id: id }, (err, post) => {
      if (err) throw err;
      if (post) {
        res.render("auth/editNewsForm", {
          title: post.title,
          content1: post.content1,
          content2: post.content2,
          content3: post.content3,
          comment: post.comment,
          date: post.date,
          images: post.images,
        });
      } else {
        console.log("something went wrong");
      }
    });
  } else if (type === "recipe") {
    Recipe.findOne({ _id: id }, (err, recipe) => {
      if (err) throw err;
      if (recipe) {
        res.render("auth/editRecipeForm", {
          title: recipe.title,
          date: recipe.date,
          content1: recipe.content1,
          content2: recipe.content2,
          content3: recipe.content3,
          submittedBy: recipe.submittedBy,
          comment: recipe.comment,
          images: recipe.images,
        });
      } else {
        console.log("something went wrong");
      }
    });
  }
};
//TODO: handle updating db
exports.edit = (req, res) => {
  const id = req.params.id;
  const type = req.params.type;
  // First need to display posts, let user choose post to edit, then post edits
  if (type === "recipe") {
  } else if (type === "news") {
  }
};

exports.sendEmail = (req, res) => {
  // Check subscription status
  let subscribe;
  req.body.subscribeNews ? (subscribe = "Yes") : (subscribe = "No");

  //Check if bot filled out form
  let bot;
  req.body.bot ? (bot = "likely") : (bot = "unlikely");

  const { name, email, msg } = req.body;

  // Timeout for animation to run before posting
  setTimeout(async () => {
    const emailHTML = await emailHandler.generateHTML("newMessageEmail", {
      name,
      email,
      subscribe,
      msg,
    });

    // Create transporter through mailgun and pass auth
    const transporter = nodemailer.createTransport(mailgun(emailHandler.auth));

    // Email options
    const mailOptions = {
      from: `🌶 Arson Sauce Message ${req.body.email}`,
      to: ["tiffaknee1@gmail.com", "arsonsauce@gmail.com"],
      subject: "New Arson Sauce Form Submission",
      html: emailHTML,
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
  }, 1300);
};

exports.notFound = (req, res) => {
  res.status(404).render("404");
};
