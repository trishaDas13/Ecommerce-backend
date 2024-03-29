const CouponModel = require("../model/coupon");
const cron = require('node-cron');

// Function to expire coupons
const expireCoupons = async () => {
  try {
    // Find coupons with end date less than current date and update isActive to false
    const result = await CouponModel.updateMany({ endDate: { $lt: new Date() } }, { $set: { isActive: false } });
    // console.log("Expired coupons updated successfully:", result);
  } catch (error) {
    console.error("Error expiring coupons:", error);
  }
};
cron.schedule('* * * * *', ()=>{expireCoupons()});

const createCoupon = async (req, res) => {
  try {
    await CouponModel.create(req.body);
    res.json({
      success: true,
      message: "Coupon created scucessfully",
    });
  } catch (err) {
    res.json({
      success: true,
      message: "Coupon created -- server error",
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
