const express = require('express');
const cors = require('cors');
require('dotenv').config();

const estudianteRoutes = require('./routes/estudianteRoutes');
const notaRoutes = require('./routes/notaRoutes');

const app = express();

const allowedOrigins = [
	'http://localhost:4200',
  'https://localhost:5000',
  'https://127.0.0.1:5000'
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error(`Origen no permitido por CORS: ${origin}`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
// app.options('/{*splat}', cors(corsOptions)); // solo si es necesario mantener OPTIONS explícito

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/api/v1/health', (req, res) => {
  res.status(200).json({
    ok: true,
    mensaje: 'Backend operativo con HTTPS',
    fecha: new Date().toISOString()
  });
});

app.use('/api/v1/estudiantes', estudianteRoutes);
app.use('/api/v1/notas', notaRoutes);

app.use((req, res) => {
  res.status(404).json({
    ok: false,
    mensaje: 'Ruta no encontrada'
  });
});

module.exports = app;
