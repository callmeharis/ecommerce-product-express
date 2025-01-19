const { StatusCodes } = require("http-status-codes");
const Product = require("../models/Product");
const getProducts = async (req, res) => {
  try {
    console.log("req.user in controllers", req.user.userId);
    const data = await Product.find({ createdBy: req.user.userId });
    res.status(StatusCodes.OK).json({
      success: true,
      data,
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      msg: "internal server error",
      error,
    });
  }
};
const createProduct = async (req, res) => {
  req.body.createdBy = req.user.userId;
  // const { title, desc, price, productImage, reviews } = req.body;

  try {
    const data = await Product.create(req.body);

    res.status(StatusCodes.OK).json({
      success: true,
      data,
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      msg: "internal server error",
      error,
    });
  }
};
const getProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    res.status(StatusCodes.OK).json({
      success: true,
      product,
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      msg: "internal server error",
      error,
    });
  }
};
const editProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const body = req.body;
    const updatedProduct = await Product.findByIdAndUpdate(id, body, {
      new: true,
    });
    res.status(StatusCodes.OK).json({
      success: true,
      updatedProduct,
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      msg: "internal server error",
      error,
    });
  }
};
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    await Product.findByIdAndDelete(id);
    res.status(StatusCodes.OK).json({
      success: true,
      msg: `Product with id ${id} has been deleted successfully`,
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      msg: "internal server error",
      error,
    });
  }
};

module.exports = {
  getProducts,
  createProduct,
  getProduct,
  editProduct,
  deleteProduct,
};
