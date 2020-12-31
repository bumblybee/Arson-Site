const { signIn } = require("../models");
const jwt = require("jsonwebtoken");
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

exports.loginWithPassword = async (username, password) => {
  const user = await signIn.findOne({ username: username });

  if (!user) {
    throw new Error("Invalid credentials");
  } else {
    const correctPassword = await bcrypt.compare(password, user.password);

    if (!correctPassword) {
      throw new Error("Invalid credentials");
    }

    const token = this.generateJWT(user);

    return { token, user };
  }
};
