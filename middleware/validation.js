const { body } = require("express-validator");

exports.validation = [
  body("name").trim().escape(),
  body("email").isEmail().normalizeEmail(),
  body("msg").trim().escape(),
];
