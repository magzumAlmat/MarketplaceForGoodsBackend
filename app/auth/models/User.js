const {DataTypes} = require('sequelize')
const sequelize = require('../../../config/db')
const Role = require('./Role')
const Company = require('./Company')

const User = sequelize.define('User', {
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true
        }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: true
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      lastname: {
        type: DataTypes.STRING,
        allowNull: true,
      },
   

},{
    timestamps:false,})

User.belongsTo(Role,{foreignKey:'roleId'})
// User.belongsTo(Company,{foreignKey:'companyId'})
module.exports = User;
