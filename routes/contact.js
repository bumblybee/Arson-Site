const express = require("express");
const router = express.Router();
const emailController = require("../controllers/emailController");

// Email form submission
router.post("/", emailController.sendEmail);

module.exports = router;
