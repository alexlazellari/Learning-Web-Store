const path = require("path");
const morgan = require("morgan");
// Set enviroment variables
require("dotenv").config({
  path: path.join(__dirname, "./config/variables.env"),
});
const cookieParser = require("cookie-parser");
const defineUserProductAssociation = require("./utils/DefinedAssociations.util");
const express = require("express");
const cors = require("cors");
const app = express();

app.use(morgan("dev"));

// Enable all cors requests
app.use(cors());

// set static file
app.use("/static", express.static(path.join(__dirname, "public")));

// Get error handler middleware
const errorHandler = require("./API/middlewares/error.middleware");

// Get all routes related to products
const productRoute = require("./API/routes/product.route");
// Get all routes related to Users
const userRoute = require("./API/routes/user.route");

// const connetion = async () => {
//   try {
//     await databaseConnection.authenticate();
//     console.log("Connection has been established successfully");
//   } catch (error) {
//     console.error(error);
//   }
// };
// connetion();

// Define many to many association of the models
defineUserProductAssociation();

// Set body and accept encoded url
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Set cookie property
app.use(cookieParser());

app.use("/api/v1", productRoute);
app.use("/api/v1", userRoute);

// Set error handler middleware
app.use(errorHandler);

// Server listen to specified port
const PORT = process.env.SERVER_PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is listening at port ${process.env.SERVER_PORT}`);
});
