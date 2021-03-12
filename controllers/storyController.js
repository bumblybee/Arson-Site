const authService = require("../services/authService");

exports.getStory = (req, res) => {
  const { auth } = authService.checkAuth(req.cookies["_PAS"]);
  res.render("story", { auth });
};
