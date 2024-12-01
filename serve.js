const dotenv = require("dotenv").config();
const bodyParser = require("body-parser");
const express = require("express");
const mongoose = require("mongoose"); // Aquí corregido, 'mongoose' como string
const cors = require("cors"); // Declaración correcta de cors
const userRoute = require("./routes/userRoute");
const productRoute = require("./routes/productRoute");
const contactRoute = require("./routes/contactRoute");
const cashClosureRoute = require("./routes/cashClosureRoutes");
const returnRoute = require('./routes/returnRoute');
const discountRoute = require('./routes/discountRoute')
const salesRoute = require('./routes/salesRoute');
const supplierRoutes = require('./routes/supplierRoutes');
const errorHandler = require("./middleWare/errorMiddleware");
const cookiePaser = require ("cookie-parser")
const app = express();
const PORT = process.env.PORT || 5000; // 'PORT' en mayúsculas es lo común
//actualizacion de imagenes 
app.get('/api/images', (req, res) => {
    const imagesDirectory = path.join(__dirname, 'public/assets');  // Asegúrate de que este sea el path correcto a tu carpeta 'assets'
  
    fs.readdir(imagesDirectory, (err, files) => {
      if (err) {
        return res.status(500).json({ message: 'Error al leer la carpeta de imágenes' });
      }
  
      // Filtra solo los archivos de imagen (por ejemplo, archivos jpg, png, etc.)
      const imageFiles = files.filter(file => /\.(jpg|jpeg|png|gif)$/i.test(file));
      
      res.json(imageFiles); // Devuelve la lista de archivos
    });
  });
// Middlewares
app.use(bodyParser.json());  // Analiza las solicitudes JSON
app.use(cors());  // Habilita CORS para todas las rutas
app.use(cookiePaser());
app.use(
    cors({
      origin: ["http://localhost:3000", "https://InventarioManga"],
      credentials: true,
    })
  );
//intermedio
app.use(express.json())
app.use(express.urlencoded({extended: false}))
app.use(bodyParser.json())
//Rutas intermedias 
app.use("/api/users",userRoute);
app.use("/api/products", productRoute);
app.use("/api/contactus", contactRoute);
app.use("/api/cash-closures", cashClosureRoute);
app.use('/api/discounts', discountRoute);
app.use('/api/returns', returnRoute);
app.use('/api/sales', salesRoute);
app.use('/api/suppliers', supplierRoutes);
//routas 
app.get("/", (req, res) => {
    res.send("inicio de pagina");
});
//Error Middleware
app.use(errorHandler);
// Conexión a la base de datos
mongoose
    .connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => {
        app.listen(PORT, () => {
            console.log(`El servidor está corriendo en el puerto ${PORT}`);
        });
    })
    .catch((err) => console.log(err));
