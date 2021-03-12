const express = require("express");
const router = express.Router();

const pricingController = require("../controllers/pricingController");

// ------- Routes -------

router.get("/", pricingController.getPricing);

module.exports = router;
