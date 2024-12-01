const asyncHandler = require("express-async-handler");
const User = require("../models/usermodel");
const bcrypt = require("bcryptjs");
const jwt = require ("jsonwebtoken");


const generateToken = (id) => {
    return jwt.sign({id},process.env.JWT_SECRET, {expiresIn:"1d"})
}

const registerUser = asyncHandler(async (req, res)=> {
   const {name, email, password}= req.body

   //validacion
   if(!name || !email || !password){
    res.status(400)
    throw new Error("completa los campos son obligatorios por favor.")
   }
   if (password.length < 6){
    res.status(400)
    throw new Error ("Por favor La contraseña debe de tener mas de 6 caracteres")
   }
   //verificacion de usuario existente 
   const userExists = await User.findOne({email})

   if(userExists){
    res.status(400)
    throw new Error ("El correo electronico a sido ya utilizado")
   }
     //encriptacion de la contraseña para la base de datos
     const salt = await bcrypt.genSalt(10)
     const hasheadPassword = await bcrypt.hash(password, salt)
   
   


   //nuevo usuario 
   const user = await User.create({
    name,
    email,
    password:hasheadPassword
   })
   //generar el token
   const token = generateToken(user._id);

   //Enviar cookie solo HTTP
   res.cookie("token", token,{
    path:"/",
    httpOnly:true,
    expires:new Date(Date.now()+1000*86400),//1 dia 
    sameSite:"none",
    secure:true
   })
   if (user){
    const{_id,name,email,photo,phone,bio}=user
    res.status(201).json({
        _id,
        name,
        email,
        photo,
        phone,
        bio,
        token
    })
   }else{
    res.status(400)
    throw new  Error ("Invalido usuario data")
   }

});
//Login usaurio
const loginUser= asyncHandler(async (req,res) => {
    const {email, password}=req.body

    //validacion de request
    if (!email || !password){
        res.status(400);
        throw new Error("Datos de los usaurios no validos ")
    }
    //checar si el usuario Existe 
    const user = await User.findOne({email})
    if(!user){
        res.status(400);
        throw new Error ("Usuario no encontrado, Por favor registrate ")
    }
   //Chekar si la contraseña es correcta 
   const passwordIsCorrect = await bcrypt.compare(password,user.password);
   //generar el token
   const token = generateToken(user._id);

   //Enviar cookie solo HTTP
   res.cookie("token", token,{
    path:"/",
    httpOnly:true,
    expires:new Date(Date.now()+1000*86400),//1 dia 
    sameSite:"none",
    secure:true
   })


   if (user && passwordIsCorrect){
    const{_id,name,email,photo,phone,bio}=user;
    res.status(200).json({
        _id,
        name,
        email,
        photo,
        photo,
        phone,
        bio,
        token,

    });
   }else{
    res.status(400);
    throw new Error("Correo electronico o contraseña no validos ")
   }

});
//para logiar el usuario
const logout = asyncHandler (async(req,res)=>{
    res.cookie("tokend","",{
        path:"/",
        httpOnly:true,
        expires:new Date(0),
        sameSite:"none",
        secure:true,
    });
    return res.status(200).json({message:"Se cerro exitosamente "})
});
// Obtener datos del usuario
const getUser = asyncHandler(async (req, res) => {
  // Buscar usuario por ID obtenido desde el token (req.user)
  const user = await User.findById(req.user._id);

  if (user) {
      const { _id, name, email, photo, phone, bio } = user;

      res.status(200).json({
          _id,
          name,
          email,
          photo,
          phone,
          bio,
      });
  } else {
      res.status(400);
      throw new Error("Usuario no encontrado");
  }
});

const loginStatus = asyncHandler(async (req, res) => {
  const token = req.cookies.token;
  if (!token) {
      return res.json(false);
  }
  // Verificar Token
  const verified = jwt.verify(token, process.env.JWT_SECRET);
  if (verified) {
      return res.json(true);
  }
  return res.json(false);
});

// Actualizar usuario
const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
      const { name, email, photo, phone, bio } = user;
      user.email = email;
      user.name = req.body.name || name;
      user.phone = req.body.phone || phone;
      user.bio = req.body.bio || bio;
      user.photo = req.body.photo || photo;

      const updatedUser = await user.save();
      res.status(200).json({
          _id: updatedUser._id,
          name: updatedUser.name,
          email: updatedUser.email,
          photo: updatedUser.photo,
          phone: updatedUser.phone,
          bio: updatedUser.bio,
      });
  } else {
      res.status(404);
      throw new Error("Usuario no encontrado");
  }
});

const changePassword = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  const { oldPassword, password } = req.body;

  if (!user) {
      res.status(400);
      throw new Error("Usuario no encontrado, por favor regístrate");
  }
  // Validar
  if (!oldPassword || !password) {
      res.status(400);
      throw new Error("Por favor agrega la contraseña antigua y la nueva");
  }

  // Verificar si la contraseña antigua coincide con la de la BD
  const passwordIsCorrect = await bcrypt.compare(oldPassword, user.password);

  // Guardar nueva contraseña
  if (user && passwordIsCorrect) {
      user.password = password;
      await user.save();
      res.status(200).send("Cambio de contraseña exitoso");
  } else {
      res.status(400);
      throw new Error("La contraseña antigua es incorrecta");
  }
});

const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
      res.status(404);
      throw new Error("El usuario no existe");
  }

  // Eliminar token si existe en la BD
  let token = await Token.findOne({ userId: user._id });
  if (token) {
      await token.deleteOne();
  }

  // Crear Token de Restablecimiento
  let resetToken = crypto.randomBytes(32).toString("hex") + user._id;
  console.log(resetToken);

  // Hashear el token antes de guardarlo en la BD
  const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

  // Guardar el Token en la BD
  await new Token({
      userId: user._id,
      token: hashedToken,
      createdAt: Date.now(),
      expiresAt: Date.now() + 30 * (60 * 1000), // Treinta minutos
  }).save();

  // Construir URL de Restablecimiento
  const resetUrl = `${process.env.FRONTEND_URL}/resetpassword/${resetToken}`;

  // Correo de Restablecimiento
  const message = `
      <h2>Hola ${user.name}</h2>
      <p>Por favor usa el siguiente enlace para restablecer tu contraseña</p>  
      <p>Este enlace es válido solo por 30 minutos.</p>

      <a href=${resetUrl} clicktracking=off>${resetUrl}</a>

      <p>Saludos...</p>
      <p>Equipo Pinvent</p>
    `;
  const subject = "Solicitud de Restablecimiento de Contraseña";
  const send_to = user.email;
  const sent_from = process.env.EMAIL_USER;

  try {
      await sendEmail(subject, message, send_to, sent_from);
      res.status(200).json({ success: true, message: "Correo de Restablecimiento Enviado" });
  } catch (error) {
      res.status(500);
      throw new Error("Correo no enviado, por favor inténtalo de nuevo");
  }
});

// Restablecer contraseña
const resetPassword = asyncHandler(async (req, res) => {
  const { password } = req.body;
  const { resetToken } = req.params;

  // Hashear el token y compararlo con el de la BD
  const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

  // Buscar el token en la BD
  const userToken = await Token.findOne({
      token: hashedToken,
      expiresAt: { $gt: Date.now() },
  });

  if (!userToken) {
      res.status(404);
      throw new Error("Token no válido o ha expirado");
  }

  // Encontrar usuario
  const user = await User.findOne({ _id: userToken.userId });
  user.password = password;
  await user.save();
  res.status(200).json({
      message: "Restablecimiento de contraseña exitoso, por favor inicia sesión",
  });
});

  
  module.exports = {
    registerUser,
    loginUser,
    logout,
    getUser,
    loginStatus,
    updateUser,
    changePassword,
    forgotPassword,
    resetPassword,
  };