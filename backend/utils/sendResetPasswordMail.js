const path = require("path");
require("dotenv").config({
  path: path.join(__dirname, "../config/variables.env"),
});
const nodemailer = require("nodemailer");

module.exports = async (user, randomString) => {
  let transporter = nodemailer.createTransport({
    host: process.env.NODEMAILER_HOST,
    port: process.env.NODEMAILER_PORT,
    auth: {
      user: process.env.NODEMAILER_USER,
      pass: process.env.NODEMAILER_PASS,
    },
  });
  let info = await transporter.sendMail({
    from: process.env.NODEMAILER_FROM,
    to: user.email,
    subject: process.env.NODEMAILER_SUBJECT,
    html: `<p>Reset password link <a href="http://127.0.0.1:3000/api/v1/user/${randomString}">http://127.0.0.1:3000/api/v1/user/${randomString}</a>.
    <br>This link will expires in 30 minutes.<p>`,
  });
};
