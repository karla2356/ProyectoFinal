const express = require("express");
const {
  createProduct,
  getProducts,
  getProduct,
  deleteProduct,
  updateProduct,
} = require("../controllers/productoController");
const router = express.Router();
const { upload } = require("../utils/fileUpload");

// Rutas sin autenticación
router.post("/", upload.single("image"), createProduct);
router.patch("/:id", upload.single("image"), updateProduct);
router.get("/", getProducts);
router.get("/:id", getProduct);
router.delete("/:id", deleteProduct);

module.exports = router;
