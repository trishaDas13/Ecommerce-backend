const express = require("express");

const couponController = require("../controller/coupon");
const authMiddleware = require("../middleWares/auth");

const router = express.Router();

router.post("/", authMiddleware(["admin"]), couponController.createCoupon);

router.get("/all", couponController.getCoupon);

module.exports = router;