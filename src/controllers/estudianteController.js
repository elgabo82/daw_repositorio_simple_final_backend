const { Estudiante, Nota } = require('../models');

function construirDatosEstudiante(body) {
  const data = {};

  if (body.cedula !== undefined) data.cedula = body.cedula;
  if (body.nombres !== undefined) data.nombres = body.nombres;
  if (body.apellidos !== undefined) data.apellidos = body.apellidos;
  if (body.email !== undefined) data.email = body.email;
  if (body.carrera !== undefined) data.carrera = body.carrera;
  if (body.semestre !== undefined) data.semestre = body.semestre === '' ? null : body.semestre;
  if (body.activo !== undefined) data.activo = body.activo;

  return data;
}

exports.crearEstudiante = async (req, res) => {
  try {
    const { cedula, nombres, apellidos, email, carrera, semestre, activo } = req.body;

    if (!cedula || !nombres || !apellidos || !email) {
      return res.status(400).json({
        ok: false,
        mensaje: 'cedula, nombres, apellidos y email son obligatorios'
      });
    }

    const existeCedula = await Estudiante.findOne({ where: { cedula } });
    if (existeCedula) {
      return res.status(409).json({
        ok: false,
        mensaje: 'Ya existe un estudiante con esa cédula'
      });
    }

    const existeEmail = await Estudiante.findOne({ where: { email } });
    if (existeEmail) {
      return res.status(409).json({
        ok: false,
        mensaje: 'Ya existe un estudiante con ese email'
      });
    }

    const estudiante = await Estudiante.create({
      cedula,
      nombres,
      apellidos,
      email,
      carrera,
      semestre,
      activo
    });

    return res.status(201).json({
      ok: true,
      mensaje: 'Estudiante registrado correctamente',
      data: estudiante
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      mensaje: 'Error al registrar el estudiante',
      error: error.message
    });
  }
};

exports.obtenerEstudiantes = async (req, res) => {
  try {
    const estudiantes = await Estudiante.findAll({
      include: [
        {
          model: Nota,
          as: 'notas'
        }
      ],
      order: [['id', 'ASC']]
    });

    return res.status(200).json({
      ok: true,
      data: estudiantes
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      mensaje: 'Error al obtener estudiantes',
      error: error.message
    });
  }
};

exports.obtenerEstudiantePorId = async (req, res) => {
  try {
    const { id } = req.params;

    const estudiante = await Estudiante.findByPk(id, {
      include: [
        {
          model: Nota,
          as: 'notas'
        }
      ]
    });

    if (!estudiante) {
      return res.status(404).json({
        ok: false,
        mensaje: 'Estudiante no encontrado'
      });
    }

    return res.status(200).json({
      ok: true,
      data: estudiante
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      mensaje: 'Error al obtener el estudiante',
      error: error.message
    });
  }
};

exports.actualizarEstudiante = async (req, res) => {
  try {
    const { id } = req.params;

    const estudiante = await Estudiante.findByPk(id);

    if (!estudiante) {
      return res.status(404).json({
        ok: false,
        mensaje: 'Estudiante no encontrado'
      });
    }

    const data = construirDatosEstudiante(req.body);

    if (data.cedula && data.cedula !== estudiante.cedula) {
      const existeCedula = await Estudiante.findOne({ where: { cedula: data.cedula } });
      if (existeCedula) {
        return res.status(409).json({
          ok: false,
          mensaje: 'La cédula ya está registrada en otro estudiante'
        });
      }
    }

    if (data.email && data.email !== estudiante.email) {
      const existeEmail = await Estudiante.findOne({ where: { email: data.email } });
      if (existeEmail) {
        return res.status(409).json({
          ok: false,
          mensaje: 'El email ya está registrado en otro estudiante'
        });
      }
    }

    await estudiante.update(data);

    return res.status(200).json({
      ok: true,
      mensaje: 'Estudiante actualizado correctamente',
      data: estudiante
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      mensaje: 'Error al actualizar el estudiante',
      error: error.message
    });
  }
};

exports.eliminarEstudiante = async (req, res) => {
  try {
    const { id } = req.params;

    const estudiante = await Estudiante.findByPk(id);

    if (!estudiante) {
      return res.status(404).json({
        ok: false,
        mensaje: 'Estudiante no encontrado'
      });
    }

    await estudiante.destroy();

    return res.status(200).json({
      ok: true,
      mensaje: 'Estudiante eliminado correctamente'
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      mensaje: 'Error al eliminar el estudiante',
      error: error.message
    });
  }
};

exports.obtenerNotasDeEstudiante = async (req, res) => {
  try {
    const { id } = req.params;

    const estudiante = await Estudiante.findByPk(id, {
      include: [
        {
          model: Nota,
          as: 'notas'
        }
      ]
    });

    if (!estudiante) {
      return res.status(404).json({
        ok: false,
        mensaje: 'Estudiante no encontrado'
      });
    }

    return res.status(200).json({
      ok: true,
      estudiante: {
        id: estudiante.id,
        cedula: estudiante.cedula,
        nombres: estudiante.nombres,
        apellidos: estudiante.apellidos,
        email: estudiante.email
      },
      notas: estudiante.notas
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      mensaje: 'Error al obtener las notas del estudiante',
      error: error.message
    });
  }
};
