const express = require("express");
const router = express.Router();
const notFoundController = require("../controllers/notFoundController");

router.get("/", notFoundController.notFound);

module.exports = router;
