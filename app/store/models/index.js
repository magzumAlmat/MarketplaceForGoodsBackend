// src/models/index.js
const sequelize = require('../../../config/db');
const Sequelize = require('sequelize');
// Убедитесь, что путь к конфигу правильный

const Product = require('./Product');
const Category = require('./Category');
const ProductImage = require('./ProductImage');
const ProductCategory = require('./ProductCategory');

// Установка ассоциаций
Product.belongsToMany(Category, { through: ProductCategory, as: 'Categories', foreignKey: 'productId' });
Category.belongsToMany(Product, { through: ProductCategory, as: 'Products', foreignKey: 'categoryId' });
Product.hasMany(ProductImage, { as: 'ProductImages', foreignKey: 'productId' });
ProductImage.belongsTo(Product, { foreignKey: 'productId' });

// Экспорт моделей
module.exports = {
  sequelize,
  Sequelize,
  Product,
  Category,
  ProductImage,
  ProductCategory,
};