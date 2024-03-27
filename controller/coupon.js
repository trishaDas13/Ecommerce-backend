const CouponModel = require("../model/coupon");

const createCoupon = async (req, res) => {
  try{
    await CouponModel.create(req.body);
  res.json({
    success: true,
    message: "Coupon created scucessfully",
  });
  }catch(err){
    res.json({
        success: true,
        message: "Coupon created server error",
      });
  }
};

const getCoupon = async (req, res) => {
  const couponsList = await CouponModel.find({ isActive: true });
  res.json({
    success: true,
    message: "List of coupons",
    result: couponsList,
  });
};

const controllers = {
  createCoupon,
  getCoupon,
};

module.exports = controllers;