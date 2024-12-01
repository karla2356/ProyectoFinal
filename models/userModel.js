const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    name:{
        type:String,
        required:[true, "Por favor ingrese el nombre"]
    },
    email:{
        type:String,
        required:[true, "Por favor ingrese el email"],
        unique: true,
        trim: true,
        match:[
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            "Por favor ingrese un correo electrónico válido"
        ]
    },
    password:{
        type:String,
        required:[true, "Por favor agregue una contraseña"],
        minLength:[6, "La contraseña debe tener al menos 6 caracteres"],
       // maxLength:[23, "La contraseña no debe ser más larga que 23 caracteres"] // Ajusta esto según lo necesario
    },
    photo:{
        type: String,
        required:[true, "Por favor ingresa una foto"],
        default: "https://i.ibb.co/4pDNDk1/avatar.png"
    },
    phone:{
        type: String,
        default: "+52"
    },
    bio:{
        type: String,
        maxLength: [250, "La biografía no debe pasar los 250 caracteres"],
        default: "bio"
    }
}, {
    timestamps: true
});

const User = mongoose.model("User", userSchema);
module.exports = User;
