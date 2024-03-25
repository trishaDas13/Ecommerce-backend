const express = require("express");
const router = express.Router();
const productController = require("../controller/product");
const authMiddleware = require("../middleWares/auth");

//todo: create product
router.post(
  "/",
  authMiddleware(["admin", "seller"]),
  productController.createProduct
);

//todo: edit product
router.patch(
  "/",
  authMiddleware(["admin", "seller"]),
  productController.editProduct
);

//todo: delete product
router.delete("/", authMiddleware(["admin"]), productController.deleteProduct);

//todo: get all product
router.get(
  "/",
  authMiddleware(["admin", "buyer", "seller"]),
  productController.getProduct
);

//todo: like & dislike
router.post(
  "/:action/:productId",
  authMiddleware(["buyer", "admin"]),
  productController.likeDislikeProduct
);

router.get(
  "/product_details",
  productController.productDetails
  
)

module.exports = router;
