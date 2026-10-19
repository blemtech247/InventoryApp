const Product = require("../models/Product");

// Create a product
const createProduct = async (req, res, next) => {
  try {
    const { costPrice, sellingPrice } = req.body;

    if (
      costPrice === undefined ||
      sellingPrice === undefined
    ) {
      return res.status(400).json({
        message: "Cost price and selling price are required"
      });
    }

    if (sellingPrice < costPrice) {
      return res.status(400).json({
        message: "Selling price cannot be lower than cost price"
      });
    }

    const product = await Product.create(req.body);

    res.status(201).json(product);
  } catch (error) {
    next(error);
  }
};

// Get all products with filtering, pagination, and sorting
const getProducts = async (req, res, next) => {
  try {
    const {
      category,
      name,
      page = 1,
      limit = 10,
      sort = "newest"
    } = req.query;

    const pageNumber = Math.max(
      1,
      parseInt(page, 10) || 1
    );

    const pageSize = Math.min(
      100,
      Math.max(1, parseInt(limit, 10) || 10)
    );

    const skip = (pageNumber - 1) * pageSize;

    const filter = {};

    if (category) {
      filter.category = category;
    }

    if (name) {
      filter.name = {
        $regex: name,
        $options: "i"
      };
    }

    const sortOptions = {
      newest: { createdAt: -1 },
      price_asc: { sellingPrice: 1 },
      price_desc: { sellingPrice: -1 },
      name_asc: { name: 1 }
    };

    if (!sortOptions[sort]) {
      return res.status(400).json({
        message: "Invalid sorting option"
      });
    }

    const products = await Product.find(filter)
      .sort(sortOptions[sort])
      .skip(skip)
      .limit(pageSize);

    const totalProducts =
      await Product.countDocuments(filter);

    res.status(200).json({
      page: pageNumber,
      limit: pageSize,
      totalProducts,
      totalPages: Math.ceil(
        totalProducts / pageSize
      ),
      products
    });
  } catch (error) {
    next(error);
  }
};

// Get one product by ID
const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(
      req.params.id
    );

    if (!product) {
      return res.status(404).json({
        message: "Product not found"
      });
    }

    res.status(200).json(product);
  } catch (error) {
    next(error);
  }
};

// Update a product
const updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(
      req.params.id
    );

    if (!product) {
      return res.status(404).json({
        message: "Product not found"
      });
    }

    const costPrice =
      req.body.costPrice ?? product.costPrice;

    const sellingPrice =
      req.body.sellingPrice ?? product.sellingPrice;

    if (sellingPrice < costPrice) {
      return res.status(400).json({
        message: "Selling price cannot be lower than cost price"
      });
    }

    product.set(req.body);

    await product.save();

    res.status(200).json({
      message: "Product updated successfully",
      product
    });
  } catch (error) {
    next(error);
  }
};

// Delete a product
const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndDelete(
      req.params.id
    );

    if (!product) {
      return res.status(404).json({
        message: "Product not found"
      });
    }

    res.status(200).json({
      message: "Product deleted successfully"
    });
  } catch (error) {
    next(error);
  }
};

// Export controller functions
module.exports = {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct
};