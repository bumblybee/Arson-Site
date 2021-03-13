const cookieEnvConfig = {};

if (process.env.NODE_ENV === "production") {
  cookieEnvConfig.secure = true;
  cookieEnvConfig.sameSite = "none";
}

module.exports = {
  httpOnly: true,
  maxAge: 3600000,
  ...cookieEnvConfig,
};
