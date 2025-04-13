const { DataTypes } = require('sequelize');
const sequelize = require('../../../config/db');

const ProductCategory = sequelize.define('ProductCategory', {
  productId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    references: {
      model: 'products',
      key: 'id',
    },
  },
  categoryId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    references: {
      model: 'categories',
      key: 'id',
    },
  },
}, {
  tableName: 'product_categories',
  timestamps: true,
});

module.exports = ProductCategory;