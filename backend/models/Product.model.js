const { Sequelize, DataTypes, Model } = require("sequelize");
const sequelize = require("../config/database");

class Product extends Model {}

// Product init
Product.init(
  {
    //Model attributes are define here
    id: {
      type: DataTypes.INTEGER(11),
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    manufacturer: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    price: {
      type: DataTypes.DOUBLE,
      allowNull: false,
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
    timestamps: false,
    sequelize, //We need to pass the connection instance
    modelName: "Product", //We need to choose the model name
  }
);

// Product.sync({ force: true });

module.exports = Product;
