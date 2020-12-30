const express = require("express");
const router = express.Router();
const loginController = require("../controllers/loginController");

//TODO: isAuth and update posts

// Render login page
router.get("/", loginController.getLoginPage);

// Post data after composing
router.post("/", loginController.loginUser);

module.exports = router;
