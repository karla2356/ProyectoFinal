const express = require('express');
const { registerSale, getSales } = require('../controllers/salesController'); // Asegúrate de importar getSales
const router = express.Router();

// Ruta para registrar una venta
router.post('/', registerSale);

// Ruta para obtener todas las ventas
router.get('/', getSales); // Añade esta línea

module.exports = router;
