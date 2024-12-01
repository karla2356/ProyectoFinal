const CashClosure = require('../models/cashClosureModel');
const mongoose = require('mongoose');

// Registrar un nuevo cierre de caja
const registerCashClosure = async (req, res) => {
    try {
        const { totalSales, date } = req.body;

        const newClosure = new CashClosure({ totalSales, date });
        const savedClosure = await newClosure.save();

        res.status(201).json(savedClosure);
    } catch (error) {
        console.error('Error al registrar el cierre de caja:', error);
        res.status(500).json({ message: 'Error al registrar el cierre de caja', error: error.message });
    }
};

// Obtener todos los cierres de caja
const getAllCashClosures = async (req, res) => {
    try {
        const closures = await CashClosure.find();
        res.status(200).json(closures);
    } catch (error) {
        console.error('Error al obtener los cierres de caja:', error);
        res.status(500).json({ message: 'Error al obtener los cierres de caja', error: error.message });
    }
};

// Eliminar un cierre de caja
const deleteCashClosure = async (req, res) => {
    try {
        const { id } = req.params;

        // Validar si el ID es un ObjectId válido de Mongoose
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'ID de cierre de caja no válido' });
        }

        const result = await CashClosure.findByIdAndDelete(id);

        // Verificar si el cierre de caja fue encontrado y eliminado
        if (!result) {
            return res.status(404).json({ message: 'Cierre de caja no encontrado' });
        }

        res.status(200).json({ message: 'Cierre de caja eliminado correctamente' });
    } catch (error) {
        console.error('Error al eliminar el cierre de caja:', error);
        res.status(500).json({ message: 'Error al eliminar el cierre de caja', error: error.message });
    }
};

module.exports = {
    registerCashClosure,
    getAllCashClosures,
    deleteCashClosure
};
