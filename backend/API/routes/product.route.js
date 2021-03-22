const Product = require("../../models/Product.model");
const ErrorHandler = require("../../utils/ErrorHandler.util");
const route = require("express").Router();
const { Sequelize, Op } = require("sequelize");
// Import catch Asycn Error method
const catchAsyncError = require("../../utils/catchAsyncError.util");

// Get all products
route.get(
  "/products",
  catchAsyncError(async (req, res, next) => {
    let { page, price, search } = req.query;

    let totalProducts;

    price = parseInt(price) ? price : 0;
    search = search ? search : "";
    page = parseInt(page) ? page : 1;

    //Handl if totalProducts === 0
    totalProducts = await Product.count({
      where: {
        price: {
          [Op.gt]: price,
        },
        name: Sequelize.where(
          Sequelize.fn("LOWER", Sequelize.col("name")),
          "LIKE",
          "%" + search + "%"
        ),
      },
    });

    const offset = (page - 1) * parseInt(process.env.PRODUCTS_PER_PAGE);

    const products = await Product.findAll({
      where: {
        price: {
          [Op.gt]: price,
        },
        name: Sequelize.where(
          Sequelize.fn("LOWER", Sequelize.col("name")),
          "LIKE",
          "%" + search + "%"
        ),
      },
      offset,
      limit: parseInt(process.env.PRODUCTS_PER_PAGE),
    });

    if (!products || !products.length) {
      return next(new ErrorHandler("Products not found", 404));
    }

    res.status(200).json({
      success: true,
      totalProducts,
      products,
    });
  })
);
// Get Single product
route.get(
  "/product/:id",
  catchAsyncError(async (req, res, next) => {
    const product = await Product.findOne({ where: { id: req.params.id } });

    if (!product) {
      return next(new ErrorHandler("Product not found", 404));
    }

    res.status(200).json({
      success: true,
      product,
    });
  })
);

// Create new product
route.post(
  "/newProduct",
  catchAsyncError(async (req, res, next) => {
    const newProduct = await Product.create(req.body);
    res.status(201).json({
      success: true,
      newProduct,
    });
  })
);

// Update product
route.put(
  "/product/:id",
  catchAsyncError(async (req, res, next) => {
    let product = await Product.findByPk(req.params.id);

    if (!product) {
      return next(new ErrorHandler("Product not found", 404));
    }

    product = await Product.update(req.body, {
      where: { id: req.params.id },
    });
    res.status(200).json({
      success: true,
      message: "Product updated successfully",
    });
  })
);

// Delete a product
route.delete(
  "/product/:id",
  catchAsyncError(async (req, res, next) => {
    const product = await Product.findByPk(req.params.id);
    if (!product) {
      return next(new ErrorHandler("Product not found.", 404));
    }

    await Product.destroy({ where: { id: req.params.id } });
    res.status(200).json({
      success: true,
      message: "Product deleted successfully.",
    });
  })
);

module.exports = route;
