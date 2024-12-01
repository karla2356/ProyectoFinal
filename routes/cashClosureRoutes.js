const express = require('express');
const {
    registerCashClosure,
    getAllCashClosures,
    deleteCashClosure
} = require('../controllers/cashClosureController');

const router = express.Router();

// Ruta para registrar un nuevo cierre de caja
router.post('/', registerCashClosure);

// Ruta para obtener todos los cierres de caja
router.get('/', getAllCashClosures);

// Ruta para eliminar un cierre de caja
router.delete('/:id', deleteCashClosure);

module.exports = router;
