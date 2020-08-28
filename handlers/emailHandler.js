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
    domain: "sandbox8c22f2f4bbff4cd3a3ccecb0bfb916cb.mailgun.org",
  },
};
