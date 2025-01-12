const { StatusCodes } = require("http-status-codes");
const Product = require("../models/Product");
const getProducts = async (req, res) => {
  try {
    const data = await Product.find({});
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
  const { title, desc, price, productImage, reviews } = req.body;

  try {
    const data = await Product.create({
      title,
      desc,
      price,
      productImage,
      reviews,
    });

    res.status(StatusCodes.OK).json({
      success: true,
      product: {
        title,
        desc,
        price,
        productImage,
        reviews,
      },
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
