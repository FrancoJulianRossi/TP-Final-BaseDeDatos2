const app = require('./app');
const mongoose = require('mongoose');
require('dotenv').config();

const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log(' Conectado a MongoDB');
    app.listen(PORT, () => {
        console.log(` Servidor corriendo en http://localhost:${PORT}`);
    });
}).catch(err => {
    console.error('Error conectando a MongoDB:', err);
});