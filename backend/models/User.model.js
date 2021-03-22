const { Sequelize, DataTypes, Model } = require("sequelize");
const sequelize = require("../config/database");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const path = require("path");
const crypto = require("crypto");
// Set enviroment variables
require("dotenv").config({
  path: path.join(__dirname, "../config/variables.env"),
});

class User extends Model {
  hashPassword() {
    this.password = bcrypt.hashSync(this.password, 10);
  }
  comparePassword(enteredPassword) {
    return bcrypt.compareSync(enteredPassword, this.password);
  }
  getJWToken() {
    const token = jwt.sign(
      { id: this.id, role: this.role },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRES_TIME,
      }
    );
    return token;
  }
  resetPassToken() {
    const randomString = crypto.randomBytes(20).toString("hex");

    const hashRandomString = crypto
      .createHash("sha256")
      .update(randomString)
      .digest("hex");

    this.resetPasswordToken = hashRandomString;
    this.resetPasswordTokenExpiresTime = new Date(Date.now() + 30 * 60 * 1000);

    return randomString;
  }
}

User.init(
  {
    //Model attributes are define here
    id: {
      type: DataTypes.INTEGER(11),
      primaryKey: true,
      autoIncrement: true,
    },
    first_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    last_name: {
      type: DataTypes.STRING(8),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: {
          args: [8],
          msg: "Your password should be at least 8 characters",
        },
      },
    },
    resetPasswordToken: {
      type: DataTypes.STRING,
    },
    resetPasswordTokenExpiresTime: {
      type: DataTypes.DATE,
    },
    // forgotPasswordUrl: {
    //   type: DataTypes.STRING,
    // },
    role: {
      type: DataTypes.ENUM({ values: ["user", "admin"] }),
      allowNull: false,
      defaultValue: "user",
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: Sequelize.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: Sequelize.NOW,
    },
  },
  {
    // defaultScope: {
    //   attributes: {
    //     exclude: [
    //       "password",
    //       "resetPasswordToken",
    //       "resetPasswordTokenExpiresTime",
    //     ],
    //   },
    // },
    scopes: {
      hideImpFields: {
        attributes: {
          exclude: [
            "password",
            "resetPasswordToken",
            "resetPasswordTokenExpiresTime",
          ],
        },
      },
    },
    timestamps: false,
    sequelize, //We need to pass the connection instance
    modelName: "User", //We need to choose the model name
  }
);

// User.sync({ alter: true });

module.exports = User;
