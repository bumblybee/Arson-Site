const { checkAuth } = require("../middleware/isAuth");

exports.notFound = (req, res) => {
  const { auth, token } = checkAuth(req.cookies["PAS"]);

  res.status(404).render("404", { auth });
};
