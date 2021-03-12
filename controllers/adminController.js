const { Recipe, News } = require("../models");
const authService = require("../services/authService");

const COOKIE_CONFIG = require("../config/cookieConfig");

exports.logoutUser = (req, res) => {
  res.clearCookie("_PAS", COOKIE_CONFIG).redirect("/");
};

exports.getLoginPage = (req, res) => {
  const { auth } = authService.checkAuth(req.cookies["_PAS"]);
  res.render("auth/login", { auth });
};

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
    res.status(403).redirect("/admin");
  }
};
