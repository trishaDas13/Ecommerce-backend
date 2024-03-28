const express = require("express");

const orderController = require("../controller/order");
const authMiddleware = require("../middleWares/auth");

const router = express.Router();

router.post("/", authMiddleware(["admin", "buyer"]), orderController.createOrder);

router.get("/", authMiddleware(["admin","buyer"]), orderController.getOrder);

module.exports = router;