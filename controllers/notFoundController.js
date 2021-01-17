const { checkAuth } = require("../middleware/isAuth");

exports.notFound = (req, res) => {
  const { auth } = checkAuth(req.cookies["_PAS"]);

  res.status(404).render("404", { auth });
};
