const { Sequelize } = require("sequelize");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "/variables.env") });

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USERNAME,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
  }
);

module.exports = sequelize;
