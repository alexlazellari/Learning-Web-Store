const path = require("path");
require("dotenv").config({
  path: path.join(__dirname, "../config/variables.env"),
});

module.exports = (user, res) => {
  const token = user.getJWToken();

  const expiresDate = new Date(
    Date.now() + process.env.COOKIE_EXPIRES_TIME * 24 * 60 * 60 * 1000
  );

  res
    .status(200)
    .cookie("access_token", token, {
      expires: expiresDate,
      httpOnly: true,
      sameSite: "lax",
    })
    .json({
      success: true,
      token,
      user,
    });
};
