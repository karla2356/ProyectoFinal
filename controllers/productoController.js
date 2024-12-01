const asyncHandler = require("express-async-handler");
const Product = require("../models/productoModel");

// Función para validar una URL
const isValidUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch (error) {
    return false;
  }
};

// Crear producto con URL de GitHub
const createProduct = asyncHandler(async (req, res) => {
  const { name, sku, category, quantity, price, description, imageUrl } = req.body;

  if (!name || !category || !quantity || !price || !description || !imageUrl) {
    res.status(400);
    throw new Error("Please fill in all fields, including the image URL.");
  }

  // Validar que la URL de la imagen sea válida
  if (!isValidUrl(imageUrl)) {
    res.status(400);
    throw new Error("Invalid image URL.");
  }

  // Validar campos numéricos
  if (isNaN(quantity) || isNaN(price) || quantity < 0 || price < 0) {
    res.status(400);
    throw new Error("Quantity and price must be positive numbers.");
  }

  const product = await Product.create({
    name,
    sku,
    category,
    quantity,
    price,
    description,
    image: { filePath: imageUrl }, // Guardar la URL de la imagen de GitHub
  });

  res.status(201).json(product);
});

// Obtener todos los productos
const getProducts = asyncHandler(async (req, res) => {
  const products = await Product.find().sort("-createdAt");
  res.status(200).json(products);
});

// Obtener un solo producto
const getProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }
  res.status(200).json(product);
});

// Eliminar producto
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }
  res.status(200).json({ message: "Product deleted successfully" });
});

// Actualizar producto con URL de GitHub
const updateProduct = asyncHandler(async (req, res) => {
  const { name, category, quantity, price, description, imageUrl } = req.body;
  const { id } = req.params;

  const product = await Product.findById(id);
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  // Validar campos numéricos
  if (isNaN(quantity) || isNaN(price) || quantity < 0 || price < 0) {
    res.status(400);
    throw new Error("Quantity and price must be positive numbers.");
  }

  // Validar la URL de la imagen si se proporciona una nueva
  if (imageUrl && !isValidUrl(imageUrl)) {
    res.status(400);
    throw new Error("Invalid image URL.");
  }

  const updatedProduct = await Product.findByIdAndUpdate(
    { _id: id },
    {
      name,
      category,
      quantity,
      price,
      description,
      image: { filePath: imageUrl || product.image.filePath }, // Mantener la URL existente si no se actualiza
    },
    { new: true, runValidators: true }
  );

  res.status(200).json(updatedProduct);
});

module.exports = {
  createProduct,
  getProducts,
  getProduct,
  deleteProduct,
  updateProduct,
};
