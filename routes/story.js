const express = require("express");
const router = express.Router();

const storyController = require("../controllers/storyController");

// ------- Routes -------

router.get("/", storyController.getStory);

module.exports = router;
