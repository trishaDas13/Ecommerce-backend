const OrderModel = require('../model/order');
const CartModel = require('../model/cart');
const CouponModel = require('../model/coupon');
const dayjs = require('dayjs')

const createOrder = async(req, res) =>{

    const userCart = await CartModel.findOne({userId: req.user._id});

    if(!userCart){
        res.json({
            success: false,
            message : "Empty cart, please add an item.",
        })
    }

    const couponCode = req.body.coupon;
    const coupon = await CouponModel.findOne({couponCode, isActive: true});

    if(!coupon){
        res.json({
            success: false,
            message : "Invalid coupon code",
        })
    }

    const couponStartDate = dayjs(coupon.startDate);  // start date of the campaign
    const couponEndDate = dayjs(coupon.endDate);      // end date of the campaign
    const today = dayjs();                             // current date and time

    if (today.isBefore(couponStartDate) || today.isAfter(couponEndDate)) {
         return res.status(404).json({
            success: false,
            message: "Coupon expired"

         })
    }

    let discount =((userCart.cartTotal / 100) * coupon.discountPercentage).toFixed(2);

    if (discount > coupon.maxDiscountInRs){
        discount =  coupon.maxDiscountInRs
    }

    const payableAmount = (userCart.cartTotal-discount).toFixed(2);

    if(req.body.modeOfPayment === "COD"){

    }else{
        
    }

    res.json({
        success: true,
        message : "Create Order Successfully",
    })
}

const getOrder = async(req, res) =>{
    res.json({
        success: true,
        message : "get Order Successfully",
    })
}

module.exports = {
    createOrder,
    getOrder
}