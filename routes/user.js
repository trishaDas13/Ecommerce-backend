const express = require('express');
const router = express.Router();
const userController = require('../controller/user');
const authMiddleware = require('../middleWares/auth')

router.post("/register",userController.userRegistration)

router.post("/login",userController.userLogin)

router.post("/logout", authMiddleware(["admin", "buyer", "seller"]), userController.userLogout)

module.exports = router
