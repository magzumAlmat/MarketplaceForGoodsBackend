

const Sequelize = require('sequelize');
const sequelize = require('../../../config/db'); // Убедись, что путь правильный
const Product = require('./Product');
const ProductImage = require('./ProductImage');
const Category = require('./Category');
const ProductCategory = require('./ProductCategory');

// Определение связей
Product.hasMany(ProductImage, { foreignKey: 'productId', as: 'images' });
ProductImage.belongsTo(Product, { foreignKey: 'productId', as: 'product' });

Product.belongsToMany(Category, {
  through: ProductCategory,
  foreignKey: 'productId',
  as: 'categories',
});
Category.belongsToMany(Product, {
  through: ProductCategory,
  foreignKey: 'categoryId',
  as: 'products',
});

// Экспорт моделей
module.exports = {
  sequelize,
  Sequelize,
  Product,
  ProductImage,
  Category,
  ProductCategory,
};