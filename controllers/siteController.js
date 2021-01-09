const { Recipe, News } = require("../models");
const { checkAuth } = require("../middleware/isAuth");

// TODO: Check if need token data anywhere, else remove

// TODO: Delete option

// TODO: Uncomment db saves at edit and compose before launch

exports.getHome = async (req, res) => {
  const { auth, token } = checkAuth(req.cookies["PAS"]);
  let recipes = await Recipe.find().sort({ date: -1 });
  let news = await News.find().sort({ date: -1 });
  recipes = recipes.filter((recipe, index) => index < 2);
  news = news.filter((news, index) => index < 1)[0];

  res.render("home", { recipes, news, auth });
};

exports.getStory = (req, res) => {
  const { auth, token } = checkAuth(req.cookies["PAS"]);
  res.render("story", { auth });
};

exports.getPricing = (req, res) => {
  const { auth, token } = checkAuth(req.cookies["PAS"]);
  //TODO: Add pricing file upload option
  const url = "https://arsonsauce.com/pdf/pricing.pdf";
  res.render("pricing", { url, auth });
};
