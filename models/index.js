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
  isDeleted: {
    type: Boolean,
    default: false,
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
  isDeleted: {
    type: Boolean,
    default: false,
  },
});

const signInSchema = new mongoose.Schema({
  username: String,
  password: String,
});

const subscriberSchema = new mongoose.Schema({
  name: String,
  email: String,
});

exports.Recipe = new mongoose.model("Recipe", recipeSchema);
exports.News = new mongoose.model("News", newsSchema);
exports.SignIn = new mongoose.model("SignIn", signInSchema);
exports.Subscriber = new mongoose.model("Subscriber", subscriberSchema);
