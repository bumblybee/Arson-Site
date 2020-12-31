const jwt = require("express-jwt");
const cookie = require("cookie");

const getToken = (req) => {
  if (req.headers) {
    const token = cookie.parse(req.headers.cookie).jwt;
    return token;
  }
};

exports.isAuth = jwt({
  secret: Buffer.from(process.env.JWT_SECRET, "base64"),
  useProperty: "token",
  getToken,
  algorithms: ["HS256"],
  credentialsRequired: true,
});
