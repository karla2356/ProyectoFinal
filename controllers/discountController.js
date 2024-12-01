const Discount = require('../models/Discount');

// Registrar un nuevo descuento
const registerDiscount = async (req, res) => {
    const { product, percentage } = req.body;

    if (!product || percentage === undefined) {
        return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    }

    try {
        const newDiscount = new Discount({
            product,
            percentage
        });

        const savedDiscount = await newDiscount.save();
        res.status(201).json(savedDiscount);
    } catch (error) {
        res.status(500).json({ message: 'Error al registrar el descuento', error: error.message });
    }
};

// Obtener todos los descuentos
const getDiscounts = async (req, res) => {
    try {
        const discounts = await Discount.find();
        res.status(200).json(discounts);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los descuentos', error: error.message });
    }
};

module.exports = { registerDiscount, getDiscounts };
