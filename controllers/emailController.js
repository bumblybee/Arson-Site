const nodemailer = require("nodemailer");
const mailgun = require("nodemailer-mailgun-transport");
const emailHandler = require("../handlers/emailHandler");
const authService = require("../services/authService");
const { logger } = require("../handlers/logger");

//TODO: if choose to subscribe, send welcome email

//TODO: re-add eric to email list before going live

exports.sendEmail = (req, res) => {
  const { auth } = authService.checkAuth(req.cookies["_PAS"]);

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

    // Create transporter and pass auth
    const transporter = nodemailer.createTransport(mailgun(emailHandler.auth));

    // Email options
    //TODO: move into emailHandler
    const mailOptions = {
      from: `🌶 Arson Sauce ${req.body.email}`,
      to: [process.env.ADMIN_EMAIL, process.env.ARSON_EMAIL],
      subject: "Arson Sauce Form Submission",
      html: emailHTML,
    };

    if (bot === "unlikely") {
      transporter.sendMail(mailOptions, (err, data) => {
        if (err) {
          logger.error(err);
          res.status(400).render("email/msgErr", { auth });
        } else {
          logger.info(
            `Email sent at contact form - name: ${name}, email: ${email}, message: ${msg}`
          );
          res.render("email/msgSent", { auth });
        }
      });
    } else {
      // If we hit this case, a bot has checked the box. Still send confirmation.
      logger.info(
        `Bot check triggered at contact form - name: ${name}, email: ${email}, msg: ${msg}`
      );
      res.render("/email/msgSent");
    }
  }, 1000);
};
