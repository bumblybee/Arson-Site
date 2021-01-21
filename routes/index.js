const express = require("express");
const router = express.Router();

const siteController = require("../controllers/siteController");

// ------- Routes -------

router.get("/", siteController.getHome);

router.get("/home", siteController.getHome);

router.get("/story", siteController.getStory);

router.get("/pricing", siteController.getPricing);

module.exports = router;
