const express = require("express");
const router = express.Router();

const siteController = require("../controllers/siteController");

// ------- Routes -------

router.get("/", siteController.getHome);

router.get("/home", siteController.getHome);

module.exports = router;
