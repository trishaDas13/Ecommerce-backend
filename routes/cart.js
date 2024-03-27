const express = require("express");

const cartController = require("../controller/cart");
const authMiddleware = require("../middleWares/auth");

const router = express.Router();

router.post(
  "/",
  authMiddleware(["admin", "seller", "buyer"]),
  cartController.createCart
);

router.get(
  "/",
  authMiddleware(["admin", "seller", "buyer"]),
  cartController.getCart
);

module.exports = router;