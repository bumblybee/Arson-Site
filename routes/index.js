const express = require("express");
const router = express.Router();
const { isAuth } = require("../middleware/isAuth");
const { catchErrors } = require("../handlers/errorHandlers");
const siteController = require("../controllers/siteController");

// TODO: Move multer config to separate file

const multer = require("multer");
const crypto = require("crypto");

const randomId = crypto.randomBytes(5).toString("hex");

// ------- Routes -------

router.get("/", siteController.getHome);

router.get("/home", siteController.getHome);

router.get("/story", siteController.getStory);

router.get("/pricing", siteController.getPricing);

module.exports = router;
