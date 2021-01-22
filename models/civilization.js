'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class civilization extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  civilization.init({
    userCivsId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'civilization',
  });
  return civilization;
};