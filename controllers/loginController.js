const { Recipe, News } = require("../models");
const authService = require("../services/authService");
const COOKIE_CONFIG = require("../config/cookieConfig");

exports.getLoginPage = (req, res) => {
  res.render("auth/login");
};

//TODO: Split these routes out separately and wire to links in navbar
exports.loginUser = async (req, res) => {
  const { username, password } = req.body;
  const { token, user } = await authService.loginWithPassword(
    username,
    password
  );

  if (token) res.cookie("PAS", token, COOKIE_CONFIG);

  if (user) {
    // res.render("home", { loggedIn: true });
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
        res.redirect("/user/login");
    }
  } else {
    res.status(403).redirect("/login");
  }
};
