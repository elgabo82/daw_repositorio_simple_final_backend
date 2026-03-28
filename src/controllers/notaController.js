const { Nota, Estudiante } = require('../models');

function construirDatosNota(body) {
  const data = {};

  if (body.asignatura !== undefined) data.asignatura = body.asignatura;
  if (body.descripcion !== undefined) data.descripcion = body.descripcion;
  if (body.nota !== undefined) data.nota = body.nota;
  if (body.periodo !== undefined) data.periodo = body.periodo;
  if (body.estudianteId !== undefined) data.estudianteId = body.estudianteId;

  return data;
}

exports.crearNota = async (req, res) => {
  try {
    const { asignatura, descripcion, nota, periodo, estudianteId } = req.body;

    if (!asignatura || nota === undefined || !estudianteId) {
      return res.status(400).json({
        ok: false,
        mensaje: 'asignatura, nota y estudianteId son obligatorios'
      });
    }

    const estudiante = await Estudiante.findByPk(estudianteId);

    if (!estudiante) {
      return res.status(404).json({
        ok: false,
        mensaje: 'El estudiante asociado no existe'
      });
    }

    const nuevaNota = await Nota.create({
      asignatura,
      descripcion,
      nota,
      periodo,
      estudianteId
    });

    return res.status(201).json({
      ok: true,
      mensaje: 'Nota registrada correctamente',
      data: nuevaNota
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      mensaje: 'Error al registrar la nota',
      error: error.message
    });
  }
};

exports.obtenerNotas = async (req, res) => {
  try {
    const notas = await Nota.findAll({
      include: [
        {
          model: Estudiante,
          as: 'estudiante',
          attributes: ['id', 'cedula', 'nombres', 'apellidos', 'email']
        }
      ],
      order: [['id', 'ASC']]
    });

    return res.status(200).json({
      ok: true,
      data: notas
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      mensaje: 'Error al obtener notas',
      error: error.message
    });
  }
};

exports.obtenerNotaPorId = async (req, res) => {
  try {
    const { id } = req.params;

    const nota = await Nota.findByPk(id, {
      include: [
        {
          model: Estudiante,
          as: 'estudiante',
          attributes: ['id', 'cedula', 'nombres', 'apellidos', 'email']
        }
      ]
    });

    if (!nota) {
      return res.status(404).json({
        ok: false,
        mensaje: 'Nota no encontrada'
      });
    }

    return res.status(200).json({
      ok: true,
      data: nota
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      mensaje: 'Error al obtener la nota',
      error: error.message
    });
  }
};

exports.obtenerNotasPorEstudiante = async (req, res) => {
  try {
    const { estudianteId } = req.params;

    const estudiante = await Estudiante.findByPk(estudianteId);

    if (!estudiante) {
      return res.status(404).json({
        ok: false,
        mensaje: 'Estudiante no encontrado'
      });
    }

    const notas = await Nota.findAll({
      where: { estudianteId },
      order: [['id', 'ASC']]
    });

    return res.status(200).json({
      ok: true,
      estudiante,
      notas
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      mensaje: 'Error al obtener notas por estudiante',
      error: error.message
    });
  }
};

exports.actualizarNota = async (req, res) => {
  try {
    const { id } = req.params;

    const notaRegistro = await Nota.findByPk(id);

    if (!notaRegistro) {
      return res.status(404).json({
        ok: false,
        mensaje: 'Nota no encontrada'
      });
    }

    const data = construirDatosNota(req.body);

    if (data.estudianteId !== undefined) {
      const estudiante = await Estudiante.findByPk(data.estudianteId);

      if (!estudiante) {
        return res.status(404).json({
          ok: false,
          mensaje: 'El nuevo estudiante asociado no existe'
        });
      }
    }

    await notaRegistro.update(data);

    return res.status(200).json({
      ok: true,
      mensaje: 'Nota actualizada correctamente',
      data: notaRegistro
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      mensaje: 'Error al actualizar la nota',
      error: error.message
    });
  }
};

exports.eliminarNota = async (req, res) => {
  try {
    const { id } = req.params;

    const notaRegistro = await Nota.findByPk(id);

    if (!notaRegistro) {
      return res.status(404).json({
        ok: false,
        mensaje: 'Nota no encontrada'
      });
    }

    await notaRegistro.destroy();

    return res.status(200).json({
      ok: true,
      mensaje: 'Nota eliminada correctamente'
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      mensaje: 'Error al eliminar la nota',
      error: error.message
    });
  }
};
