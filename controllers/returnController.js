const Return = require('../models/Return');

// Registrar una devolución
const registerReturn = async (req, res) => {
    const { product, reason, image } = req.body;

    if (!product || !reason) {
        return res.status(400).json({ message: 'Por favor, proporciona todos los campos requeridos.' });
    }

    try {
        const newReturn = new Return({
            product,
            reason,
            image
        });

        const savedReturn = await newReturn.save();

        res.status(201).json({
            message: 'Devolución registrada con éxito',
            returnItem: savedReturn
        });
    } catch (error) {
        console.error('Error al registrar la devolución:', error);
        res.status(500).json({ message: 'Error al registrar la devolución', error: error.message });
    }
};

// Obtener todas las devoluciones
const getReturns = async (req, res) => {
    try {
        const returns = await Return.find();
        res.status(200).json(returns);
    } catch (error) {
        console.error('Error al obtener devoluciones:', error);
        res.status(500).json({ message: 'Error al obtener devoluciones', error: error.message });
    }
};

module.exports = { registerReturn, getReturns };
