const { Recipe, News } = require("../models");
const authService = require("../services/authService");

// TODO: Delete option

exports.getHome = async (req, res) => {
  const { auth } = authService.checkAuth(req.cookies["_PAS"]);
  let recipes = await Recipe.find({ isDeleted: false }).sort({ date: -1 });
  let news = await News.find({ isDeleted: false }).sort({ date: -1 });
  recipes = recipes.filter((recipe, index) => index < 2);
  news = news.filter((news, index) => index < 1)[0];

  res.render("home", { recipes, news, auth });
};
