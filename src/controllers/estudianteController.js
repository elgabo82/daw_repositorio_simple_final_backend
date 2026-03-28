const { Estudiante, Nota } = require('../models');

function construirDatosEstudiante(body) {
    const datos = {};

    if (body.cedula !== undefined) datos.cedula = body.cedula;
    if (body.nombres !== undefined) datos.nombres = body.nombres;
    if (body.apellidos !== undefined) datos.apellidos = body.apellidos;
    if (body.email !== undefined) datos.email = body.email;
    if (body.carrera !== undefined) datos.carrera = body.carrera;
    if (body.semestre !== undefined) datos.semestre = body.semestre === '' ? null : body.semestre;
    if (body.activo !== undefined) datos.activo = body.activo;

    return datos;
}

exports.crearEstudiante = asycn (req, res) => {
    try {
        const { cedula, nombres, apellidos, email, carrera, semestre, activo } = req.body;

        if (!cedula || !nombres || !apellidos || !email) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Cédula, nombres, apellidos y correo son obligatorios.'
            });
        }


        const existeCedula = await Estudiante.findOne({where: {cedula}});

        if (existeCedula) {
            return res.status(409).json({
                ok: false,
                mensaje: 'Ya existe un estudiante con esa cédula.'
            });
        }

        const existeCorreo = await Estudiante.findOne({where: {email}});

        if (existeCorreo) {
            return res.status(409).json({
                ok: false,
                mensaje: 'Ya existe un estudiante con ese correo.'
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

        return res.status(200).json({
            ok: true,
            mensaje: 'Estudiante registrado con éxito.',
            datos: estudiante
        });

    } catch (error) {
        return res.status(500).json({
            ok: false,
            mensaje: 'Error al registrar el estudiante.',
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
            include: [{
                model: Nota,
                as: 'notas'
            }]
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