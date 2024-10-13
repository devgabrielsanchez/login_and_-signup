const mongoose = require('mongoose');
const connect = mongoose.connect('mongodb://localhost:27017/');

//funcion para comprobar si esta conectada a base de dato o no
connect.then(() => {
    console.log('Base de dato conectada exitosamente');
})
    .catch(() => {
        console.log('Base de dato no pudo ser conectada');
    })

//Creacion de esquema 
const loginSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});

//Perte de coleccion
const collection = new mongoose.model('user', loginSchema);

module.exports = collection;
