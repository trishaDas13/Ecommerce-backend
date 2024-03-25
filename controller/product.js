const ProductModel = require("../model/product");
// const jwt = require("jsonwebtoken");

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

//todo: get the product
const getProduct = async (req, res) => {
  const productList = await ProductModel.find({});
  res.json({
    success: true,
    result: productList,
  });
};

//todo: delete the product
const deleteProduct = async (req, res) => {
  try {
    await ProductModel.deleteOne({ _id: req.body._id });
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

//todo: like & dislike the product
const likeDislikeProduct = async (req, res) => {
  try{
    let filedName = 'liked'
  let updateObject = {
    $addToSet: { likes: req.user._id },
    $pull: { dislikes: req.user._id}
  }
  if (req.params.action === "dislike") {
    updateObject = {
      $addToSet: { dislikes: req.user._id },
      $pull: { likes: req.user._id}
    }
    filedName = 'disliked'
  }
  const updatedProduct = await ProductModel.findByIdAndUpdate( 
    req.params.productId,
    updateObject,
  );
  res.json({
    success: true,
    message: `product has been ${filedName} by you`,
  });

  }catch(err){
    res.status(500).json({
      success: false,
      message: "Error updating product",
    });
  }
};

//todo: get the full details of particular product
const productDetails = async (req, res) => {
  const productDetails = await ProductModel.findById(req.query.productId)
    .populate({
      path: "likes",
      select: "firstname lastname"
    })
    .populate({
      path: "dislikes",
      select: "firstname lastname"
    });
  res.json({
    success: true,
    message: "Get full details of the product",
    result: productDetails,
  });
};

module.exports = {
  createProduct,
  editProduct,
  getProduct,
  deleteProduct,
  likeDislikeProduct,
  productDetails,
};
