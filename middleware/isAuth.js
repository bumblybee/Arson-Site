const jwt = require("express-jwt");

const cookie = require("cookie");

const getTokenFromHeader = (req) => {
  if (req.headers) {
    const token = cookie.parse(req.headers.cookie)._PAS;
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
