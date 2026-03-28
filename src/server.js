const fs = require('fs');
const path = require('path');
const https = require('https');
require('dotenv').config();

const app = require('./app');
const sequelize = require('./config/database');
const { iniciarModelos } = require('./models');

const PORT = process.env.PORT || 5000;

/*const sslOptions = {
    key: fs.readFileSync(path.resolve(process.cwd(), process.env.SSL_KEY_PATH)),
    cert: fs.readFileSync(path.resolve(process.cwd(), process.env.SSL_CERT_PATH))
};*/

async function iniciarServidor() {
    try {
        iniciarModelos();

        await sequelize.authenticate();
        console.log('Conexión a MySQL establecida correctamente.');
        
        await sequelize.sync({ alter: true, force: true });
        console.log('Modelos sincronizados correctamente.');
        https.createServer(app).listen(PORT, () => {
        console.log(`Servidor backend disponible en http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('Error al iniciar el backend:', error);
    }
}

iniciarServidor();