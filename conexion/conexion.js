
const mongoose = require('mongoose');
require('dotenv').config();

//Traemos las url de conexiones a Mongo
const MONGOLOCAL = process.env.MONGOLOCAL;
const MONGOATLAS = process.env.MONGOATLAS;

//Conexión a la database de Mongo - 2
mongoose.connect(MONGOATLAS, {
    useNewUrlParser: true, 
    useUnifiedTopology: true, 
})
    .then(()=> {
        console.log(`Database conectada a Local/Atlas`);
    })
    .catch((error) => {
        console.log(`El error es: ${error}`)
    })
