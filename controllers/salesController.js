const Product = require("../models/productModel");
const Sale = require("../models/salesModel");

const createSale = async (req, res, next) => {
  try {
    const { product, quantitySold } = req.body;

    // Step 1: Find the product
    const existingProduct = await Product.findById(product);

    // Step 2: Check whether the product exists
    if (!existingProduct) {
      return res.status(404).json({
        message: "Product not found"
      });
    }

    // Step 3: Check whether enough stock is available
    if (existingProduct.quantity < quantitySold) {
      return res.status(400).json({
        message: "Insufficient stock"
      });
    }

    // We'll add the sales calculations 
    const totalRevenue = existingProduct.sellingPrice * quantitySold;
    const totalCost = existingProduct.costPrice * quantitySold;
    const profit = totalRevenue - totalCost;
    const sale = await Sale.create({
  product: existingProduct._id,
  quantitySold,
  sellingPrice: existingProduct.sellingPrice,
  costPrice: existingProduct.costPrice,
  totalRevenue,
  totalCost,
  profit
});
existingProduct.quantity -= quantitySold;

await existingProduct.save();

res.status(201).json({
  message: "Sale completed successfully",
  sale,
  remainingStock: existingProduct.quantity
});

  } catch (error) {
    next(error);
  }
};

module.exports = { createSale };