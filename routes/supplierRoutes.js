const express = require('express');
const router = express.Router();
const { createSupplier } = require('../controllers/supplierController');
const Supplier = require('../models/Supplier'); // Asegúrate de importar tu modelo Supplier

// Ruta para registrar un proveedor
router.post('/', createSupplier);

// Ruta para obtener todos los proveedores
router.get('/', async (req, res) => { // Cambia '/suppliers' a '/' para que coincida con la base del router
    try {
        const suppliers = await Supplier.find(); // Asegúrate de que el modelo Supplier esté importado correctamente
        res.json(suppliers);
    } catch (error) {
        console.error('Error al obtener proveedores:', error);
        res.status(500).json({ message: 'Error al obtener proveedores' });
    }
});

module.exports = router;
