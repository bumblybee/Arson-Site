const express = require("express");
const router = express.Router();
const loginController = require("../controllers/loginController");

// Render login page
router.get("/login", loginController.getLoginPage);

// Post data after composing
router.post("/", loginController.loginUser);

module.exports = router;
