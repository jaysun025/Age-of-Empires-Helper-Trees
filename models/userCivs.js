'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class userCivs extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.userCivs.hasOne(models.civilization)
      models.userCivs.belongsTo(models.user)
    }
  };
  userCivs.init({
    userId: DataTypes.INTEGER,
    userName: DataTypes.STRING  
  }, {
    sequelize,
    modelName: 'userCivs',
  });
  return userCivs;
};