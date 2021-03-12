const authService = require("../services/authService");

exports.getPricing = (req, res) => {
  const { auth } = authService.checkAuth(req.cookies["_PAS"]);
  //TODO: Add pricing file upload option
  const url = "https://arsonsauce.com/pdf/pricing.pdf";
  res.render("pricing", { url, auth });
};
