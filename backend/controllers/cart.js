const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const User = require("../models/user");
const Product = require("../models/product");

const addCart = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { productId } = req.body;
    const user = await User.findById(new ObjectId(userId).toString());

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.cart.includes(new ObjectId(productId).toString())) {
      return res
        .status(400)
        .json({ status: true, message: "Product is already in cart" });
    }

    user.cart.push(productId);
    await user.save();

    const product = await Product.findById(productId);
    res.status(200).json({
      status: true,
      message: "Product added to cart",
      product,
    });
  } catch (err) {
    return res
      .status(400)
      .json({ status: false, message: "Internal server error" });
  }
};

const removeCart = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { productId } = req.body;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ status: false, message: "User not found" });
    }

    const product = await Product.findById(new ObjectId(productId).toString());
    if (!product) {
      return res
        .status(404)
        .json({ status: false, message: "product not found" });
    }

    if (!user.cart.includes(productId)) {
      return res
        .status(400)
        .json({ status: false, message: "Product not in cart" });
    }

    user.cart = await user.cart.filter((item) => !item.equals(productId));
    await user.save();

    res
      .status(200)
      .json({ status: true, message: "Product removed from cart", product });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = { addCart, removeCart };
