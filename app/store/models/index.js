// src/models/index.js
const Product = require('./Product');
const Category = require('./Category');
const ProductCategory = require('./ProductCategory');

// Многие-ко-многим
Product.belongsToMany(Category, { through: ProductCategory, foreignKey: 'productId' });
Category.belongsToMany(Product, { through: ProductCategory, foreignKey: 'categoryId' });

// Экспорт моделей
module.exports = {
  Product,
  Category,
  ProductCategory,
  sequelize,
};