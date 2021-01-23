'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class techUnit extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.techUnit.hasMany(models.tech)
      models.techUnit.hasMany(models.unit)
      models.techUnit.belongsTo(models.civilization)
    }
  };
  techUnit.init({
    civilizatonId: DataTypes.INTEGER,
    civilizationName: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'techUnit',
  });
  return techUnit;
};