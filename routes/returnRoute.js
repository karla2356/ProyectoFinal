const express = require('express');
const router = express.Router();
const { registerReturn, getReturns } = require('../controllers/returnController');

// Ruta para registrar una devolución
router.post('/', registerReturn);

// Ruta para obtener todas las devoluciones
router.get('/', getReturns);

module.exports = router;
