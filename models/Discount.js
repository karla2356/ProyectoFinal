const mongoose = require('mongoose');

const discountSchema = new mongoose.Schema({
    product: {
        type: String,
        required: true,
        trim: true
    },
    percentage: {
        type: Number,
        required: true,
        min: 0,
        max: 100
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Discount = mongoose.model('Discount', discountSchema);

module.exports = Discount;
