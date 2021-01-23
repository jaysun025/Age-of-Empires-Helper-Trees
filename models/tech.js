'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class tech extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.tech.belongsTo(models.techUnit)
    }
  };
  tech.init({
    techUnitId: DataTypes.INTEGER,
    techUnitName: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'tech',
  });
  return tech;
};