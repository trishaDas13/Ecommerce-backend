const mongoose = require("mongoose");
const addressSchema = new mongoose.Schema({
  address: {
    type: String,
    required: false,
    deault: "",
  },
  city: {
    type: String,
    requied: false,
    default: "",
  },
  state: {
    type: String,
    requied: false,
    default: "",
  },
  pincode: {
    type: String,
    requied: false,
    default: "",
  },
});

const userSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: true,
  },
  lastname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
  },
  token: {
    type: String,
  },
  address: {
    type: addressSchema,
  },
  wishlist: {
    type: [mongoose.Schema.Types.ObjectId],
    default: [],
  },
});

module.exports = mongoose.model("users", userSchema);
