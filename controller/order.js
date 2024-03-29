const OrderModel = require("../model/order");
const CartModel = require("../model/cart");
const CouponModel = require("../model/coupon");
const dayjs = require("dayjs");
const Razorpay = require("razorpay");
const dotenv = require("dotenv");
dotenv.config();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const createOrder = async (req, res) => {
  const userCart = await CartModel.findOne({ userId: req.user._id });

  if (!userCart) {
    res.json({
      success: false,
      message: "Empty cart, please add an item.",
    });
  }

  const couponCode = req.body.coupon;
  const coupon = await CouponModel.findOne({ couponCode, isActive: true });

  if (!coupon) {
    res.json({
      success: false,
      message: "Invalid coupon code",
    });
  }

  const couponStartDate = dayjs(coupon.startDate); // start date of the campaign
  const couponEndDate = dayjs(coupon.endDate); // end date of the campaign
  const today = dayjs(); // current date and time

  if (today.isBefore(couponStartDate) || today.isAfter(couponEndDate)) {
    return res.status(404).json({
      success: false,
      message: "Coupon expired",
    });
  }

  let discount = (
    (userCart.cartTotal / 100) *
    coupon.discountPercentage
  ).toFixed(2);

  if (discount > coupon.maxDiscountInRs) {
    discount = coupon.maxDiscountInRs;
  }

  const payableAmount = (userCart.cartTotal - discount).toFixed(2);

  let deliveryAddress = req.body.deliveryAddress;
  if (!deliveryAddress) {
    deliveryAddress = req.user.address;
  }

  const deliveryDate = dayjs().add(7, "day");

  const newOrder = await OrderModel.create({
    cart: userCart,
    userId: req.user._id,
    amount: payableAmount,
    coupon: coupon._id,
    deliveryAddress,
    orderPlacedAt: today,
    deliveryDate,
    orderStatus: "Placed",
    modeOfPayment: req.body.modeOfPayment,
  });
  let pgResponse;
  if (req.body.modeOfPayment !== "COD") {
    const options = {
      amount: amount * 100, // Amount in paisa E.g 50Rs = 5000
      currency: "INR",
      receipt: newOrder._id, // Unique Ordre ID
      payment_capture: 1, // Ignore
    };
    try {
      pgResponse = await razorpay.orders.create(options);
      console.log("RAZORPAY pgResponse", pgResponse);
    } catch (err) {
      console.log(err);
    }
  }

  res.json({
    success: true,
    message: "Create Order Successfully",
    orderId: newOrder._id,
    paymentInformation: {
      amount: pgResponse.amount_due,
      orderId: pgResponse.id,
      currency: pgResponse.currency,
    },
  });
};

const getOrder = async (req, res) => {
  res.json({
    success: true,
    message: "get Order Successfully",
  });
};

module.exports = {
  createOrder,
  getOrder,
};
