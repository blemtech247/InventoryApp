const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
name: {
type: String,
required: true,
trim: true,
minlength: 2,
maxlength: 30
},

category: {
    type: String,
    required: true,
    trim: true,
    minlength: 3,
    maxlength: 30
},

costPrice: {
    type: Number,
    required: true,
    min: 0
},

sellingPrice: {
    type: Number,
    required: true,
    min: 0,
    validate: {
        validator: function (value) {
            return value >= this.costPrice;
        },
        message: "Selling price cannot be lower than cost price"
    }
},

quantity: {
    type: Number,
    required: true,
    min: 0
}

}, {
timestamps: true
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;