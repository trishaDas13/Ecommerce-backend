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
  try {
    let filedName = "liked";
    let updateObject = {
      $addToSet: { likes: req.user._id },
      $pull: { dislikes: req.user._id },
    };
    if (req.params.action === "dislike") {
      updateObject = {
        $addToSet: { dislikes: req.user._id },
        $pull: { likes: req.user._id },
      };
      filedName = "disliked";
    }
    const updatedProduct = await ProductModel.findByIdAndUpdate(
      req.params.productId,
      updateObject
    );
    res.json({
      success: true,
      message: `product has been ${filedName} by you`,
    });
  } catch (err) {
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
      select: "firstname lastname",
    })
    .populate({
      path: "dislikes",
      select: "firstname lastname",
    });
  res.json({
    success: true,
    message: "Get full details of the product",
    result: productDetails,
  });
};

//todo: add  a new review to a specific product
const reviewProduct = async (req, res) => {
  const product = await ProductModel.findById(req.params.productId);

  const review = product.reviews.find(
    (review) => review.userId.toString() === req.user._id.toString()
  );
  if (review) {
    const findObject = {
      reviews: {
        $elemMatch: {
          userId: req.user._id,
          rating: review.rating,
        },
      },
    };

    const updateObject = {
      $set: {
        "reviews.$.rating": req.body.rating,
        "reviews.$.comment": req.body.comment,
      },
    };

    const updateResult = await ProductModel.updateOne(findObject, updateObject);

    res.json({
      success: true,
      message: "review has been updated",
    });
  } else {
    const updatedObj = {
      $push: {
        reviews: {
          rating: req.body.rating,
          comment: req.body.comment,
          userId: req.user._id,
        },
      },
    };

    await ProductModel.findByIdAndUpdate(req.params.productId, updatedObj, {
      new: true,
    });

    res.json({
      success: true,
      message: "Product has been reviewed by you",
    });
  }
};

module.exports = {
  createProduct,
  editProduct,
  getProduct,
  deleteProduct,
  likeDislikeProduct,
  productDetails,
  reviewProduct,
};
