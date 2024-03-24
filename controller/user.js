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
  const expiryDateTime = Math.floor(new Date().getTime() / 1000) + 3600; // 1 hour from now

  if (isPasswordValid) {
    const payload = {
      id: user._id,
      name: user.firstname,
      role: user.role,
      exp: expiryDateTime,
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET_KEY); //* generate token with JWT

    //* check if the user already present or not.
    if (user.token !== null) {
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

const controllers = {
  userRegistration,
  userLogin,
  userLogout,
};

module.exports = controllers;
