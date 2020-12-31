const ejs = require("ejs");
const juice = require("juice");
const dotenv = require("dotenv");
dotenv.config();

exports.generateHTML = async (filename, options) => {
  const html = await ejs.renderFile(
    `${__dirname}/../views/email/${filename}.ejs`,
    options
  );
  return juice(html);
};

exports.auth = {
  auth: {
    api_key: process.env.MAILGUN_KEY,
    domain: process.env.MAILGUN_SANDBOX,
  },
};
