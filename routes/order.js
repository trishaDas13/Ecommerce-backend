const express = require("express");

const orderController = require("../controller/order");
const authMiddleware = require("../middleWares/auth");

const router = express.Router();

router.post("/", authMiddleware(["admin", "buyer"]), orderController.createOrder);

router.get("/", authMiddleware(["admin","buyer"]), orderController.getOrder);

router.post("/payment/payment-status", (req, res) => {
    const body = req.body;
  });
  
module.exports = router;