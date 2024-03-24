const ProductModel = require("../model/product");
const jwt = require("jsonwebtoken");

//todo: create the product
const createProduct = async (req, res) => {
  const newProduct = await ProductModel.create({ ...req.body });
  res.json({
    success: true,
    message: "Product has been created",
  });
};

//todo: edit the product
const editProduct = async (req, res) => {
  try {
    await ProductModel.updateOne(
      {
        _id: req.body._id,
      },
      {
        $set: req.body,
      }
    );

    res.json({
      success: true,
      message: "products has been updated",
    });
  } catch (err) {
    return res.status(404).json({
      success: false,
      message: "error faced at the time of updating product",
    });
  }
};

const getProduct = async (req, res) => {
  const productList = await ProductModel.find({});
  res.json({
    success: true,
    result: productList,
  });
};

const deleteProduct = async (req, res) => {
    try {
        await ProductModel.deleteOne({_id: req.body._id})
        res.json({
          success: true,
          message: "Product deleted successfully",
        });
      } catch (err) {
        res.status(500).json({
          success: false,
          message: "Something went wrong, please try again after some time",
        });
      }
};

module.exports = {
  createProduct,
  editProduct,
  getProduct,
  deleteProduct
};
