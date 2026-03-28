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
        

    } catch (error) {
        return res.status(500).json({
            ok: false,
            mensaje: 'Error al registrar el estudiante.',
            error: error.message
        });
    }
}