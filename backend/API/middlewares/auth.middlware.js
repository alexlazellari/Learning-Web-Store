const jwt = require("jsonwebtoken");
const User = require("../../models/User.model");
const ErrorHandler = require("../../utils/ErrorHandler.util");
const catchAsyncError = require("../../utils/catchAsyncError.util");

module.exports.authUser = catchAsyncError(async (req, res, next) => {
  const cookies = req.cookies;
  if (!cookies) {
    return next(new ErrorHandler("Login first to access this resource", 401));
  }
  const access_token = req.cookies.access_token;

  if (!access_token) {
    return next(new ErrorHandler("Login first to access this resource", 401));
  }

  let decodedToken = "";

  jwt.verify(access_token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) return next(err);
    decodedToken = decoded;
  });

  if (!decodedToken) return;

  const user = await User.findByPk(decodedToken.id);
  if (!user) return next(new ErrorHandler("User not found.", 404));

  req.authUser = decodedToken;

  next();
});

module.exports.authRole = (...roles) => (req, res, next) => {
  if (!roles.includes(req.authUser.role))
    return next(
      new ErrorHandler(
        `Role (${req.authUser.role}) is not allowed to access this resource`,
        403
      )
    );
  next();
};
