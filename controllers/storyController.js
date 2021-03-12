const { checkAuth } = require("../middleware/isAuth");

exports.getStory = (req, res) => {
  const { auth } = checkAuth(req.cookies["_PAS"]);
  res.render("story", { auth });
};
