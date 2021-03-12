const express = require("express");
const router = express.Router();

const homeController = require("../controllers/homeController");

// ------- Routes -------

router.get("/", homeController.getHome);

router.get("/home", homeController.getHome);

module.exports = router;
