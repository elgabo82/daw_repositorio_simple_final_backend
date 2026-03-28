const express = require('express');
const router = express.Router();
const notaController = require('../controllers/notaController');

router.post('/', notaController.crearNota);
router.get('/', notaController.obtenerNotas);
router.get('/estudiante/:estudianteId', notaController.obtenerNotasPorEstudiante);
router.get('/:id', notaController.obtenerNotaPorId);
router.put('/:id', notaController.actualizarNota);
router.delete('/:id', notaController.eliminarNota);

module.exports = router;