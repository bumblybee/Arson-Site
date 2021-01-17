const { Recipe, News } = require("../models");
const authService = require("../services/authService");
const { checkAuth } = require("../middleware/isAuth");

const COOKIE_CONFIG = require("../config/cookieConfig");

exports.getLoginPage = (req, res) => {
  const { auth } = checkAuth(req.cookies["_PAS"]);
  res.render("auth/login", { auth });
};

//TODO: Split these routes out separately and wire to links in navbar
exports.loginUser = async (req, res) => {
  const { username, password } = req.body;
  const { token, user } = await authService.loginWithPassword(
    username,
    password
  );

  if (token) res.cookie("_PAS", token, COOKIE_CONFIG);

  if (user) {
    res.redirect("/");
  } else {
    res.status(403).redirect("/login");
  }
};
