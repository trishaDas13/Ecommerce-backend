const express = require('express');
const router = express.Router();
const userController = require('../controller/user');
const authMiddleware = require('../middleWares/auth')

router.post("/register",userController.userRegistration)

router.post("/login",userController.userLogin)

router.post("/logout", authMiddleware(["admin", "buyer", "seller"]), userController.userLogout)

router.post("/add_to_wishlist", authMiddleware(["admin", "buyer"]), userController.addToWishlist)

router.get("/get_the_wishlist", authMiddleware(["admin", "buyer"]), userController.getWishlist)

router.post("/address", authMiddleware(["admin", "buyer", "seller"]), userController.saveAddress)

module.exports = router
