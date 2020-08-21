const mongoose = require("mongoose");

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

exports.Recipe = new mongoose.model("Recipe", recipeSchema);
exports.News = new mongoose.model("News", newsSchema);
exports.signIn = new mongoose.model("SignIn", signInSchema);