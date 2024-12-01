const mongoose = require('mongoose');

const returnSchema = new mongoose.Schema({
    product: {
        type: String,
        required: [true, 'El nombre del producto es obligatorio']
    },
    reason: {
        type: String,
        required: [true, 'El motivo de la devolución es obligatorio']
    },
    date: {
        type: Date,
        default: Date.now
    },
    image: {
        type: String,
        default: '' // Campo opcional para almacenar la URL de la imagen
    }
});

const Return = mongoose.model('Return', returnSchema);

module.exports = Return;
