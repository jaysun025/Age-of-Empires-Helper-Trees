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
      models.civilization.belongsTo(models.userCivs)
      models.civilization.hasMany(models.techUnit)
    }
  };
  civilization.init({
    userCivsId: DataTypes.INTEGER,
    userCivsName: DataTypes.STRING  
  }, {
    sequelize,
    modelName: 'civilization',
  });
  return civilization;
};