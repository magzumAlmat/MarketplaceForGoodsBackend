// src/models/Category.js
const { DataTypes } = require('sequelize');
const sequelize = require('../../../config/db');

const Category = sequelize.define('Category', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: true,
    },
  },
}, {
  timestamps: true,
  tableName: 'categories',
});

module.exports = Category;