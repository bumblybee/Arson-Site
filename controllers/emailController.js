const nodemailer = require("nodemailer");
const mailgun = require("nodemailer-mailgun-transport");
const emailHandler = require("../handlers/emailHandler");

exports.sendEmail = (req, res) => {
  // Check subscription status
  let subscribe;
  req.body.subscribeNews ? (subscribe = "Yes") : (subscribe = "No");

  //Check if bot filled out form
  let bot;
  req.body.bot ? (bot = "likely") : (bot = "unlikely");

  const { name, email, msg } = req.body;

  // Timeout for animation to run before posting
  setTimeout(async () => {
    const emailHTML = await emailHandler.generateHTML("newMessageEmail", {
      name,
      email,
      subscribe,
      msg,
    });

    // Create transporter through mailgun and pass auth
    const transporter = nodemailer.createTransport(mailgun(emailHandler.auth));

    // Email options
    const mailOptions = {
      from: `🌶 Arson Sauce ${req.body.email}`,
      to: [process.env.ADMIN_EMAIL, process.env.ARSON_EMAIL],
      subject: "Arson Sauce Form Submission",
      html: emailHTML,
    };

    if (bot === "unlikely") {
      transporter.sendMail(mailOptions, (err, data) => {
        if (err) {
          res.render("email/msgErr");
        } else {
          res.render("email/msgSent");
        }
      });
    } else {
      //Send confirmation even though not sent so they don't know it didn't go through
      res.render("email/msgSent");
    }
  }, 1200);
};
