const userModel = require("../model/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

//todo: registration api
const userRegistration = async (req, res) => {
  //*for  security reasons we are hashing the password before storing
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(req.body.password, salt);

  try {
    const newUser = new userModel({
      ...req.body,
      password: hash,
    });
    await newUser.save();
    res.json({
      success: true,
      message: "Registration done, log in to continue",
    });
  } catch (err) {
    res.status(404).json({
      success: false,
      message: "error occured when registered",
      error: err,
    });
  }
};

//todo: login api
const userLogin = async (req, res) => {
  const user = await userModel.findOne({
    email: req.body.email,
  });
  //* if email does not match
  if (!user) {
    res.status(404).json({
      message: "Invalid user",
    });
  }

  //* user password validation check
  const isPasswordValid = bcrypt.compareSync(req.body.password, user.password);

  //* expiry time calculation
  const expiryDateTime = Math.floor(new Date().getTime() / 1000) + (3 * 3600); // 3 hour from now

  if (isPasswordValid) {
    const payload = {
      id: user._id,
      name: user.firstname,
      role: user.role,
      exp: expiryDateTime,
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET_KEY); //* generate token with JWT

    //* check if the user already present or not.
    if (user.token) {
      return res.status(401).json({
        success: false,
        message: "You are already logged in",
      });
    }

    //* Save the token to the user document in the database
    if (!user.token || Date.now() >= payload.exp * 1000) {
      const updateToken = token;
      user.token = updateToken;
      await user.save();
    }

    res.json({
      success: true,
      message: "User Login successfully",
      token,
    });
  } else {
    return res.json({
      success: false,
      message: "Invalid username or password",
    });
  }
};

//todo: logout api
const userLogout = async (req, res) => {
  try {
    const user = await userModel.findOne({ token: req.headers.authorization });

    if (user) {
      user.token = null;
      await user.save();
    }
    res.json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

//todo: add product to user's wishlist
const addToWishlist = async(req, res) =>{
  const updateObj = {
    $push: {
      wishlist: req.body.productId
    }
  }
 await userModel.findByIdAndUpdate(req.user._id, updateObj)
  res.json({
    success: true,
    message: "Product added to wishlist"
  })
}

//todo: get product from user's wishlist
const getWishlist = async(req, res) =>{
  const user = await  userModel.findById(req.user._id)
  .select("wishlist")
 
  res.json({
    success: true,
    message: "all the product from your wishlist",
    wishlisted_item : user.wishlist
  })
}

const saveAddress = async(req, res) => { const address = req.body;
  const setObject = {};

  if (address.address) {
    setObject["address.address"] = address.address;
  }

  if (address.city) {
    setObject["address.city"] = address.city;
  }

  if (address.state) {
    setObject["address.state"] = address.state;
  }

  if (address.pincode) {
    setObject["address.pincode"] = address.pincode;
  }
  const updateObj = {
    $set: setObject
  }
  await userModel.findByIdAndUpdate(req.user._id, updateObj)
  res.json({
    success: true,
    message:  "Your adress has been updated"
  })
}

const controllers = {
  userRegistration,
  userLogin,
  userLogout,
  addToWishlist,
  getWishlist,
  saveAddress
};

module.exports = controllers;
