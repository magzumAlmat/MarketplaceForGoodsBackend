const Sequelize = require('sequelize');
const sequelize = require('../../../config/db');
const Product = require('./Product');
const ProductImage = require('./ProductImage');

// Определение связей
Product.hasMany(ProductImage, { foreignKey: 'productId', as: 'images' });
ProductImage.belongsTo(Product, { foreignKey: 'productId', as: 'product' });

module.exports = {
  sequelize,
  Sequelize,
  Product,
  ProductImage,
};