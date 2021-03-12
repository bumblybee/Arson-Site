const authService = require("../services/authService");

exports.notFound = (req, res) => {
  const { auth } = authService.checkAuth(req.cookies["_PAS"]);

  res.status(404).render("404", { auth });
};
