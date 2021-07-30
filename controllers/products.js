const Product = require("../models/products");

exports.createProduct = async (req, res, next) => {
  const product = new Product({ ...req.body, owner: req.user._id });

  try {
    await product.save();
    res.status(201).json({
      success: true,
      data: product,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.readProduct = async (req, res, next) => {
  try {
    // const product = await Product.findById(req.params.id);
    const product = await Product.findOne({
      _id: req.params.id,
      // owner: req.user._id,
    });
    if (!product) {
      res.status(404).json({
        success: false,
        message: `Not found`,
      });
    }
    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateProduct = async (req, res, next) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["name", "description", "price"];
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  if (!isValidOperation) {
    res.status(400).json({ success: false, error: "Invalid Update!" });
  }

  try {
    const product = await Product.findOne({
      _id: req.params.id,
      owner: req.user._id,
    });
    if (!product) {
      return res.status(404).json({ msg: `Not found` });
    }
    res.status(200).json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAllProducts = async (req, res, next) => {
  try {
    const products = await Product.find({});
    if (!products) {
      return res.status(404).json({ msg: `Not found` });
    }
    res
      .status(200)
      .json({ success: true, count: products.length, data: products });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteProduct = async (req, res, next) => {
  try {
    // const product = await Product.findByIdAndDelete(req.params.id);
    const product = await Product.findOneAndDelete({
      _id: req.params.id,
      owner: req.user._id,
    });

    if (!product) {
      return res
        .status(404)
        .send({ success: false, error: "Product not found" });
    }
    res.status(200).json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
