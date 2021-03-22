const { Sequelize, DataTypes, Model } = require("sequelize");
const sequelize = require("../config/database");

class Market extends Model {}

//Market init
Market.init(
  {
    created_at: {
      type: DataTypes.DATE,
      defaultValue: Sequelize.now,
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: Sequelize.now,
    },
  },
  {
    timestamps: false,
    sequelize, //We need to pass the connection instance
    modelName: "Market", //We need to choose the model name
  }
);

// Market.sync({ force: true });

module.exports = Market;
