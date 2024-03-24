const express = require("express");
const router = express.Router();
const productController = require("../controller/product");
const authMiddleware = require("../middleWares/auth");

router.post(
  "/",
  authMiddleware(["admin", "seller"]),
  productController.createProduct
);

router.patch(
  "/",
  authMiddleware(["admin", "seller"]),
  productController.editProduct
);

router.delete(
  "/",
  authMiddleware(["admin"]),
  productController.deleteProduct
);

router.get(
  "/",
  authMiddleware(["admin", "buyer", "seller"]),
  productController.getProduct
);

module.exports = router;
