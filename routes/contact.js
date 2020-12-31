const express = require("express");
const router = express.Router();
const emailController = require("../controllers/emailController");

// Email form submission
router.post("/", emailController.sendEmail);

//TODO: Comment out sent and err routes after design finished
router.get("/sent", (req, res) => {
  res.render("email/msgSent");
});

router.get("/error", (req, res) => {
  res.render("email/msgErr");
});

module.exports = router;
