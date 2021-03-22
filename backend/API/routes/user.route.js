const router = require("express").Router();
const User = require("../../models/User.model");
const catchAsyncError = require("../../utils/catchAsyncError.util");
const ErrorHandler = require("../../utils/ErrorHandler.util");
const sendResetPasswordMail = require("../../utils/sendResetPasswordMail");
const crypto = require("crypto");
const { Op, where } = require("sequelize");
const sendToken = require("../../utils/sendToken");
const { authUser, authRole } = require("../middlewares/auth.middlware");
const { response } = require("express");
const { findAll } = require("../../models/User.model");

router.route("/user/register").post(
  catchAsyncError(async (req, res, next) => {
    const { first_name, last_name, email, password } = req.body;
    let user = await User.build({
      first_name,
      last_name,
      email,
      password,
    }).validate();

    user.hashPassword();
    await user.save();

    // Send access token in a httpOnly cookie
    excludeFields(user);
    sendToken(user, res);
  })
);

router.route("/user/login").post(
  catchAsyncError(async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return next(
        new ErrorHandler("You must provide both email and password", 400)
      );
    }

    const user = await User.findOne({ where: { email } });
    if (!user) return next(new ErrorHandler("Invalid email or password", 401));

    const validUser = user.comparePassword(password);

    if (!validUser)
      return next(new ErrorHandler("Invalid email or password", 401));

    // Send access token in a httpOnly cookie
    excludeFields(user);
    sendToken(user, res);
  })
);

router.route("/user/logout").get((req, res, next) => {
  res
    .status(200)
    .cookie("access_token", null, {
      expires: new Date(Date.now()),
      httpOnly: true,
      sameSite: "lax",
    })
    .json({
      success: true,
      message: "You have successfully logged out.",
    });
});

router.route("/user/password/forgot").post(
  catchAsyncError(async (req, res, next) => {
    const user = await User.findOne({ where: { email: req.body.email } });

    if (!user) {
      return next(new ErrorHandler("User not found", 404));
    }
    const resetPassToken = user.resetPassToken();

    await sendResetPasswordMail(user, resetPassToken);

    user.validate();
    user.save();

    res.status(200).json({
      success: true,
      message: "Your password reset email has been sent.",
    });
  })
);

router.route("/user/password/reset/:token").put(
  catchAsyncError(async (req, res, next) => {
    const token = req.params.token;
    if (!token) {
      return next(
        new ErrorHandler(
          "Password reset token is invalid or has been expired.",
          400
        )
      );
    }
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      where: {
        resetPasswordToken: hashedToken,
        resetPasswordTokenExpiresTime: {
          [Op.gt]: new Date(),
        },
      },
    });

    if (!user) {
      return next(
        new ErrorHandler(
          "Password reset token is invalid or has been expired.",
          400
        )
      );
    }

    const newPassword = req.body.password;
    const confirmNewPassword = req.body.confirmPassword;

    if (newPassword !== confirmNewPassword) {
      return next(new ErrorHandler("Passwords do not match", 400));
    }

    user.password = newPassword;
    await user.validate();
    user.hashPassword();

    user.resetPasswordToken = null;
    user.resetPasswordTokenExpiresTime = null;
    await user.validate();
    await user.save();

    // Send access token in a httpOnly cookie
    excludeFields(user);
    sendToken(user, res);
  })
);

router.route("/user/me").get(
  authUser,
  catchAsyncError(async (req, res, next) => {
    const user = await User.findByPk(req.authUser.id);

    excludeFields(user);

    res.status(200).json({
      success: true,
      user,
    });
  })
);

//Change update password => /api/v1/user/password/update

router.route("/user/password/update").put(
  authUser,
  catchAsyncError(async (req, res, next) => {
    const user = await User.findByPk(req.authUser.id);

    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword)
      return next(
        new ErrorHandler("Old password or new password is missing.", 400)
      );

    const passMatched = user.comparePassword(oldPassword);

    if (!passMatched)
      return next(new ErrorHandler("Old password is incorrect.", 400));

    await user.update({ password: newPassword });
    user.hashPassword();
    await user.save();

    res.status(200).json({
      success: true,
      message: "Your password has been successfully changed",
    });
  })
);

router.route("/user/me/update").put(
  authUser,
  catchAsyncError(async (req, res, next) => {
    const { first_name, last_name, email } = req.body;

    await User.update(
      { first_name, last_name, email },
      { where: { id: req.authUser.id } }
    );

    res.status(200).json({
      success: true,
      message: "Update completed successfully.",
    });
  })
);

router.route("/admin/users").get(
  authUser,
  authRole("admin"),
  catchAsyncError(async (req, res, next) => {
    const users = await User.scope("hideImpFields").findAll();
    if (!users) return next(new ErrorHandler("Users not found.", 404));
    res.status(200).json({
      success: true,
      users,
    });
  })
);

router.route("/admin/user/:id").get(
  authUser,
  authRole("admin"),
  catchAsyncError(async (req, res, next) => {
    const user = await User.scope("hideImpFields").findOne({
      where: { id: req.params.id },
    });

    if (!user) return next(new ErrorHandler("User not found.", 404));

    res.status(200).json({
      success: true,
      user,
    });
  })
);

router.route("/admin/user/:id").put(
  authUser,
  authRole("admin"),
  catchAsyncError(async (req, res, next) => {
    const newUserDate = {
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      email: req.body.email,
      role: req.body.role,
    };

    const user = await User.findOne({ where: { id: req.params.id } });

    if (!user) next(new ErrorHandler("User not found", 404));

    await User.update(newUserDate, {
      where: {
        id: req.params.id,
      },
    });

    res.status(200).json({
      success: true,
      message: "Update completed successfully.",
    });
  })
);

router.route("/admin/user/:id").delete(
  authUser,
  authRole("admin"),
  catchAsyncError(async (req, res, next) => {
    const user = await User.findByPk(req.params.id);
    if (!user) return next(new ErrorHandler("User not found.", 404));

    await User.destroy({ where: { id: req.params.id } });

    res.status(200).json({
      success: true,
    });
  })
);

function excludeFields(user) {
  delete user.dataValues.password;
  delete user.dataValues.resetPasswordToken;
  delete user.dataValues.resetPasswordTokenExpiresTime;
  return user;
}

module.exports = router;
