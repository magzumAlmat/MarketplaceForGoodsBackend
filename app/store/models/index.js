// src/models/index.js
const Product = require('./Product');
const ProductImage = require('./ProductImage');
const Category = require('./Category');
const ProductCategory = require('./ProductCategory');

// Связь один-ко-многим: один товар имеет много изображений
Product.hasMany(ProductImage, { foreignKey: 'productId', as: 'images' });
ProductImage.belongsTo(Product, { foreignKey: 'productId' });

// Связь многие-ко-многим для категорий (из предыдущего ответа)
Product.belongsToMany(Category, { through: ProductCategory, foreignKey: 'productId' });
Category.belongsToMany(Product, { through: ProductCategory, foreignKey: 'categoryId' });

module.exports = {
  Product,
  ProductImage,
  Category,
  ProductCategory,
  sequelize,
};