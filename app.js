const express = require("express");

const mongoose = require("mongoose");
const nodemailer = require("nodemailer");
const mailgun = require("nodemailer-mailgun-transport");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const multer = require("multer");
const crypto = require("crypto");

const dotenv = require("dotenv");
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const randomId = crypto.randomBytes(5).toString("hex");

// --------------- Multer Setup ---------
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/img");
  },
  filename: (req, file, cb) => {
    //Added randomID in case same photo name uploaded later
    cb(
      null,
      file.originalname.split(".")[0] +
        randomId +
        "." +
        file.originalname.split(".")[1]
    );
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === "image/jpeg" || file.mimetype == "image/png") {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
  fileFilter: fileFilter,
});

// --------------- MongoDB Code ------------------
// mongo "mongodb+srv://arson-sauce-2cvre.mongodb.net/arsonSauce" --username admin-tiffani

//TODO: change db password
mongoose.connect(
  `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_NAME}-2cvre.mongodb.net/arsonSauce?retryWrites=true&w=majority`,
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
  content1: {
    type: String,
    required: [true, "Please enter content."],
  },
  content2: {
    type: String,
    required: [false],
  },
  content3: {
    type: String,
    required: [false],
  },
  submittedBy: String,
  comment: String,

  images: [
    {
      type: Object,
      required: [true, "Please add an image file."],
    },
  ],
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
  content1: {
    type: String,
    required: [true, "Please add content."],
  },
  content2: {
    type: String,
  },
  content3: {
    type: String,
  },
  comment: String,
  images: [
    {
      type: Object,
      required: [true, "Please add an image file."],
    },
  ],
});

const signInSchema = new mongoose.Schema({
  username: String,
  password: String,
});

const Recipe = mongoose.model("Recipe", recipeSchema);
const News = mongoose.model("News", newsSchema);
const signIn = new mongoose.model("SignIn", signInSchema);

// const newPost = new News({
//   title: "Test",
//   date: "test",
//   content1: "Testing",
// });

// newPost.save();

app.get("/", (req, res) => {
  Recipe.find({}, (err, recipes) => {
    //TODO: Include a news item on home page when I have content
    if (err) throw err;
    //Grab first three recipes
    recipes = recipes.filter((recipe, index) => index < 3);
    res.render("home", { recipes });
  }).sort({ date: -1 });
});

app.get("/news", (req, res) => {
  News.find({}, (err, posts) => {
    if (err) throw err;

    res.render("news", { posts });
  }).sort({ date: -1 });
});

app.get("/news/:id", (req, res) => {
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
});

app.get("/recipes", (req, res) => {
  Recipe.find({}, (err, recipes) => {
    if (err) throw err;
    // res.set("Content-Type", newRecipe.img.contentType);
    res.render("recipes", { recipes });
  }).sort({ date: -1 });
});

app.get("/recipes/:recipeID", (req, res) => {
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
});

app.get("/story", (req, res) => {
  res.render("story");
});

//Get rid of sent and sendErr GET routes after design finished
app.get("/sent", (req, res) => {
  res.render("msgSent");
});

app.get("/error", (req, res) => {
  res.render("msgErr");
});

// Render login page
app.get("/login", (req, res) => {
  res.render("login");
});

//render compose page on login
app.post("/login", (req, res) => {
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
});

app.get("/compose/:type", (req, res) => {
  const type = req.params.type;
  type === "news" ? res.render("composeNews") : res.render("composeRecipe");
});

app.post("/compose/:type", upload.any(), (req, res) => {
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
});

// //compose and post new recipe or news item
// app.post("/compose", upload.array("imgFiles", 3), (req, res) => {
//   if (req.body.postType === "news") {
//     const newPost = new News({
//       title: req.body.title,
//       date: req.body.date,
//       content1: req.body.content1,
//       content2: req.body.content2,
//       content3: req.body.content3,
//       comment: req.body.comment,
//       imgs: req.files,
//     });
//     console.log("It worked", newPost);
//     newPost.save();
//     res.redirect("/news");
//   } else if (req.body.postType === "recipe") {
//     console.log("It's a recipe");
//     const newRecipe = new Recipe({
//       title: req.body.title,
//       date: req.body.date,
//       content1: req.body.content1,
//       content2: req.body.content2,
//       content3: req.body.content3,
//       submittedBy: req.body.submittedBy,
//       comment: req.body.comment,
//       imgs: req.files,
//       // imgSrc: `/img/${req.file.filename}`,
//     });
//     console.log(req.files);
//     newRecipe.save();
//     res.redirect("/recipes");
//   }
// });

// Contact form submission
app.post("/sendEmail", (req, res) => {
  //Check if bot filled out form
  let bot;
  req.body.bot ? (bot = "yes") : (bot = "no");

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
        api_key: process.env.MAILGUN_KEY,
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
