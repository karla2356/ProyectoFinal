const express = require('express');
const { registerDiscount, getDiscounts } = require('../controllers/discountController');
const router = express.Router();

// Ruta para registrar un nuevo descuento
router.post('/', registerDiscount);

// Ruta para obtener todos los descuentos
router.get('/', getDiscounts);

module.exports = router;
