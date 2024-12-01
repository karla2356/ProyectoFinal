const mongoose = require('mongoose');

const salesSchema = new mongoose.Schema(
    {
        product: {
            type: String,
            required: [true, 'El nombre del producto es obligatorio'],
        },
        quantity: {
            type: Number,
            required: [true, 'La cantidad es obligatoria'],
            min: [1, 'La cantidad debe ser al menos 1'],
        },
    },
    { timestamps: true }
);

const Sale = mongoose.model('Sale', salesSchema);

module.exports = Sale;
