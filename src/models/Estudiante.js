/*
 Modelo: Estudiantes
*/


const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Estudiante = sequelize.define('Estudiante', {
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true
    },
    cedula: {
        type: DataTypes.STRING(13),
        allowNull: false,
        unique: true,
        validate: {
            notEmpty: true,
            len: [5, 13]
        }
    },
    nombres: {
        type: DataTypes.STRING(100),
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    apellidos: {
        type: DataTypes.STRING(100),
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    email: {
        type: DataTypes.STRING(120),
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true,
            notEmpty: true
        }
    },
    carrera: {
        type: DataTypes.STRING(120),
        allowNull: true
    },
    semestre: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true,
        validate: {
            min: 1,
            max: 9
        }
    },
    activo: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
    }
}, {
    tableName: 'estudiantes',
    timestamps: true
});

module.exports = Estudiante;