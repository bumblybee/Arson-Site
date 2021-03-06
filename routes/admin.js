const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const { catchErrors } = require("../handlers/errorHandlers");

// Render login page
router.get("/", adminController.getLoginPage);

router.post("/", catchErrors(adminController.loginUser));

router.get("/logout", adminController.logoutUser);

module.exports = router;
