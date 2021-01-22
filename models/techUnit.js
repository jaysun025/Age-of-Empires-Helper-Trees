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
    }
  };
  techUnit.init({
    civilizatonId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'techUnit',
  });
  return techUnit;
};