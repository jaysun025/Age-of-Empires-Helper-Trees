'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class unit extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.unit.belongsTo(models.techUnit)
    }
  };
  unit.init({
    techUnitId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'unit',
  });
  return unit;
};