const express = require('express');
const router = express.Router();
const estudianteController = require('../controllers/estudianteController');

router.post('/', estudianteController.crearEstudiante);
router.get('/', estudianteController.obtenerEstudiantes);
router.get('/:id', estudianteController.obtenerEstudiantePorId);
router.put('/:id', estudianteController.actualizarEstudiante);
router.delete('/:id', estudianteController.eliminarEstudiante);
router.get('/:id/notas', estudianteController.obtenerNotasDeEstudiante);

module.exports = router;
