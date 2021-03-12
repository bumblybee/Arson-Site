const { Recipe, News } = require("../models");
const { checkAuth } = require("../middleware/isAuth");

// TODO: Delete option

exports.getHome = async (req, res) => {
  const { auth } = checkAuth(req.cookies["_PAS"]);
  let recipes = await Recipe.find().sort({ date: -1 });
  let news = await News.find().sort({ date: -1 });
  recipes = recipes.filter((recipe, index) => index < 2);
  news = news.filter((news, index) => index < 1)[0];

  res.render("home", { recipes, news, auth });
};
