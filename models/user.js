'use strict';
const bcrypt = require('bcrypt')

const {
  Model
} = require('sequelize');
const favovorites = require('./favovorites');
module.exports = (sequelize, DataTypes) => {
  class user extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.user.hasMany(models.userCivs)
      models.user.hasMany(models.favovorites)
    }
  };
  user.init({
    name: { 
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: {
        args: [2, 25],
        msg: 'Name must be 2 to 25 characters long.'
      }
    }
    },
    email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
    isEmail: {
      args: true,
      msg: 'Please enter a valid email address.'
    }
    }
  },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: {
          args: [8,99],
          msg: 'Password must be between 8 and 99 characters long.'
        }
      }
      }
    },{ 
    sequelize,
    modelName: 'user',
  });

  user.addHook('beforeCreate', (pendingUser, options)=> {
    console.log(`OG PASSWORD: ${pendingUser.password}`)
    let hashedPassword = bcrypt.hashSync(pendingUser.password, 10) 
    console.log(`HASHED PASSWORD: ${hashedPassword}`)
    pendingUser.password = hashedPassword
  })

  user.prototype.validPassword = async function(passwordInput) {
    console.log(`passwordInput: ${passwordInput}`)
    let match = await bcrypt.compare(passwordInput, this.password)
    console.log(`?????????? WAS THE PASSWORD A MATCH???: ${match}`)
    return match
  }

  return user;
};