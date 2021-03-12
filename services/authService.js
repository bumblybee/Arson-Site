const { SignIn } = require("../models");
const jwt = require("jsonwebtoken");
const jsonwebtoken = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const saltRounds = 10;

exports.generateJWT = (user) => {
  const data = {
    id: user._id,
    username: user.username,
  };

  const secret = Buffer.from(process.env.JWT_SECRET, "base64");
  const expiration = "2h";
  return jwt.sign({ data }, secret, {
    expiresIn: expiration,
  });
};

exports.checkAuth = (cookie) => {
  let auth = false;
  let token = null;
  // TODO: remove token in future if not using
  if (cookie) {
    const decoded = jsonwebtoken.verify(
      cookie,
      Buffer.from(process.env.JWT_SECRET, "base64")
    );

    if (decoded) {
      auth = true;
      token = decoded;
    }
  }
  return { auth };
};

exports.loginWithPassword = async (username, password) => {
  const user = await SignIn.findOne({ username: username });

  if (user) {
    const correctPassword = await bcrypt.compare(password, user.password);

    if (!correctPassword) {
      return new Error("Invalid credentials");
    }

    const token = this.generateJWT(user);

    return { token, user };
  } else {
    return new Error("Invalid credentials");
  }
};
