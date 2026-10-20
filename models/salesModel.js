const salesSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true
  },

  quantitySold: {
    type: Number,
    required: true,
    min: 1
  },

  sellingPrice: {
    type: Number,
    required: true,
    min: 0
  },

  costPrice: {
    type: Number,
    required: true,
    min: 0
  },

  totalRevenue: {
    type: Number,
    required: true,
    min: 0
  },

  totalCost: {
    type: Number,
    required: true,
    min: 0
  },

  profit: {
    type: Number,
    required: true
  }
}, {
  timestamps: true
});