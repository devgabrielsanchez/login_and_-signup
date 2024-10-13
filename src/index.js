const express = require('express');
const path = require('path');
const bcrypt = require('bcrypt');
const collection = require('./config');

const app = express();
//convertimos los datos en formato json
app.use(express.json());

app.use(express.urlencoded({ extended: false }));
//usando ejs como vistas
app.set('view engine', 'ejs');

//usando archivo 'public'
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.render('login');
})

app.get('/signup', (req, res) => {
    res.render('signup');
})

//Registro usuario
app.post('/signup', async (req, res) => {
    const data = {
        name: req.body.username,
        password: req.body.password
    }
    //metodo para comprobar si el usuario ya exite en la base de datos
    const existingUser = await collection.findOne({ name: data.name });
    if (existingUser) {
        res.send('El usuario ya existe. Por favor pruebe con diferente nombre de usuario');
    } else {
        //usamos hash para encriptar la contraseña con bcrypt
        const saltRound = 10;//numero de salto de ronda para bcrypt
        const hashedPassword = await bcrypt.hash(data.password, saltRound);//await=esperar

        data.password = hashedPassword;//Reemplaza el hash de password con el original password

        const userdata = await collection.insertMany(data);
        console.log(userdata);
    }

});

//User login
app.post('/login', async (req, res) => {
    try {
        const check = await collection.findOne({ name: req.body.username });
        if (check) {
            res.send('Usuario no encontrado');
        }
        //Compara el hash de password desde la base de dato con texto plano
        const isPasswordMatch = await bcrypt.compare(req.body.password, check.password);
        if (isPasswordMatch) {
            res.render('home');
        } else {
            res.send('Contraseña incorrecta');
        }

    } catch {                  //atrapar
        res.send('Detalles incorrectos');
    }

});

const port = 5100;
app.listen(port, () => {
    console.log(`servicio corriendo en puerto: ${port}`);
})