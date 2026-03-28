const Estudiante = require('./Estudiante');
const Nota = require('./Nota');

function initModels() {
  Estudiante.hasMany(Nota, {
    foreignKey: 'estudianteId',
    as: 'notas',
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE'
  });

  Nota.belongsTo(Estudiante, {
    foreignKey: 'estudianteId',
    as: 'estudiante',
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE'
  });
}

module.exports = {
  Estudiante,
  Nota,
  initModels
};
