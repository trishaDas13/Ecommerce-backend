const CartModel = require("../model/cart");
const ProductModel = require("../model/product");

// Function to create or update user's cart
const createCart = async (req, res) => {
  // Check if the user already has a cart
  const userCart = await CartModel.findOne({ userId: req.user._id });
  
  if (userCart){
    // Cart exists, update it
    let cartTotal = 0;
    const productsToUpdate = [];
    
    // Iterate through each product in the request body
    for (let i = 0; i < req.body.products.length; i++) {
      const currentProduct = req.body.products[i];
      
      // Find the price of the product from the ProductModel
      const { price } = await ProductModel.findById(currentProduct.productId, {
        price: 1,
        _id: 0,
      });

      // Calculate total price for the product and update cartTotal
      const priceForProduct = currentProduct.quantity * price;
      cartTotal += priceForProduct;
      
      // Push product with updated price to productsToUpdate array
      const product = {
        ...currentProduct,
        price,
      };
      productsToUpdate.push(product);
      
      // Reduce the stock count of the product
      await ProductModel.findByIdAndUpdate(
        currentProduct.productId,
        { $inc: { stock: -currentProduct.quantity } }
      );
    }

    try {
      // Update the existing cart with new products and cartTotal
      const updatedCart = await CartModel.findOneAndUpdate(
        { userId: req.user._id },
        { $set: { products: productsToUpdate, cartTotal: cartTotal } },
        { new: true }
      );
      
      // Respond with updated cart
      res.json({
        success: true,
        message: "User cart updated successfully",
        cart: updatedCart,
      });
    } catch (error) {
      // Handle error if updating cart fails
      res.status(500).json({
        success: false,
        message: "Failed to update user cart",
        error: error.message,
      });
    }
  }  else {
    // Cart doesn't exist, create a new one
    let cartTotal = 0;
    const productsToAdd = [];
    
    // Iterate through each product in the request body
    for (let i = 0; i < req.body.products.length; i++) {
      const currentProduct = req.body.products[i];
      
      // Find the price of the product from the ProductModel
      const { price } = await ProductModel.findById(currentProduct.productId, {
        price: 1,
        _id: 0,
      });

      // Calculate total price for the product and update cartTotal
      const priceForProduct = currentProduct.quantity * price;
      cartTotal += priceForProduct;
      
      // Push product with updated price to productsToAdd array
      const product = {
        ...currentProduct,
        price,
      };
      productsToAdd.push(product);
      
      // Reduce the stock count of the product
      await ProductModel.findByIdAndUpdate(
        currentProduct.productId,
        { $inc: { stock: -currentProduct.quantity } }
      );
    }

    try {
      // Create a new cart with the products and cartTotal
      const newCart = await CartModel.create({
        products: productsToAdd,
        cartTotal: cartTotal,
        userId: req.user._id,
      });
      
      // Respond with the newly created cart
      res.status(201).json({
        success: true,
        message: "User cart created successfully",
        cart: newCart,
      });
    } catch (error) {
      // Handle error if creating cart fails
      res.status(500).json({
        success: false,
        message: "Failed to create user cart",
        error: error.message,
      });
    }
  }
};

// Function to get user's cart
const getCart = async (req, res) => {
  try {
    // Find the user's cart based on userId
    const userCart = await CartModel.findOne({ userId: req.user._id });
    if (userCart) {
      // Respond with user's cart if found
      res.json({
        success: true,
        message: "User cart retrieved successfully",
        cart: userCart,
      });
    } else {
      // Respond with error if user's cart is not found
      res.status(404).json({
        success: false,
        message: "User cart not found",
      });
    }
  } catch (error) {
    // Handle error if getting cart fails
    res.status(500).json({
      success: false,
      message: "Failed to get user cart",
      error: error.message,
    });
  }
};

// Exporting the controller functions
const controllers = {
  createCart,
  getCart,
};

module.exports = controllers;
