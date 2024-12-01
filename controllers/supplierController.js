const Supplier = require('../models/Supplier');

// Crear un nuevo proveedor
const createSupplier = async (req, res) => {
    const { name, contact } = req.body;

    // Validar que los campos no estén vacíos
    if (!name || !contact) {
        return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    }

    try {
        const newSupplier = new Supplier({ name, contact });
        await newSupplier.save();
        return res.status(201).json(newSupplier); // Responde con el nuevo proveedor creado
    } catch (error) {
        console.error('Error al registrar proveedor:', error);
        return res.status(500).json({ message: 'Error en el servidor al registrar proveedor' }); // Asegúrate de retornar en el error también
    }
};

module.exports = { createSupplier };
