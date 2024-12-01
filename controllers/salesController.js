const Sale = require('../models/salesModel');

// Registrar una venta


// Función para registrar una venta
const registerSale = async (req, res) => {
    const { product, quantity } = req.body;
    try {
        const newSale = new Sale({ product, quantity });
        await newSale.save();
        res.status(201).json(newSale);
    } catch (error) {
        res.status(400).json({ message: 'Error al registrar la venta', error });
    }
};

// Función para obtener todas las ventas
const getSales = async (req, res) => {
    try {
        const sales = await Sale.find(); // Obtiene todas las ventas
        res.status(200).json(sales);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener las ventas', error });
    }
};

module.exports = {
    registerSale,
    getSales, // Exporta la nueva función
};
