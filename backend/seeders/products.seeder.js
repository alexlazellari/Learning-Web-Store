const products = require("../data/products.json");
const sequelize = require("../config/database");
const queryInterface = sequelize.getQueryInterface();

const up = async (queryInterface, Sequelize) => {
  /**
   * Add seed commands here.
   *
   * Example:
   * await queryInterface.bulkInsert('People', [{
   *   name: 'John Doe',
   *   isBetaMember: false
   * }], {});
   */

  products.map((product) => {
    product.created_at = new Date();
    product.updated_at = new Date();
  });

  await queryInterface.bulkInsert("products", products);
};

const down = async (queryInterface, Sequelize) => {
  /**
   * Add commands to revert seed here.
   *
   * Example:
   * await queryInterface.bulkDelete('People', null, {});
   */
  await queryInterface.bulkDelete("products", {}, null);
};

// Insert products in table
up(queryInterface, sequelize);

// Delete products from table
// down(queryInterface,sequelize);
