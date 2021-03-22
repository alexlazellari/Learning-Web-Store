//Product model
const Product = require("../models/Product.model");
//User model
const User = require("../models/User.model");
// Market model
const Market = require("../models/Market.model");

const defineUserProductAssociation = async () => {
  // M: N
  User.belongsToMany(Product, { through: Market });
  Product.belongsToMany(User, { through: Market });
  // await sequelize.sync();
};

module.exports = defineUserProductAssociation;
