const express = require("express");
const router = express.Router();
const emailController = require("../controllers/emailController");
const { validation } = require("../middleware/validation");
const { catchErrors } = require("../handlers/errorHandlers");

// Email form submission
router.post("/", validation, catchErrors(emailController.sendEmail));

// TODO: Comment out sent and err routes after design finished
router.get("/sent", (req, res) => {
  res.render("email/msgSent");
});

router.get("/error", (req, res) => {
  res.render("email/msgErr");
});

module.exports = router;
