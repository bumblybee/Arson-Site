const jwt = require("express-jwt");
const jsonwebtoken = require("jsonwebtoken");
const cookie = require("cookie");

const getTokenFromHeader = (req) => {
  if (req.headers) {
    const token = cookie.parse(req.headers.cookie).PAS;
    return token;
  }
};

exports.isAuth = jwt({
  secret: Buffer.from(process.env.JWT_SECRET, "base64"),
  userProperty: "token",
  requestProperty: "token",
  getToken: getTokenFromHeader,
  algorithms: ["HS256"],
  credentialsRequired: true,
});

exports.checkAuth = (cookie) => {
  let auth = false;
  let token = null;

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
