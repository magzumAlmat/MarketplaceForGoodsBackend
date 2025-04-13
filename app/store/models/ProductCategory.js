// src/models/ProductCategory.js
'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class ProductCategory extends Model {
    static associate(models) {
      ProductCategory.belongsTo(models.Product, { foreignKey: 'productId' });
      ProductCategory.belongsTo(models.Category, { foreignKey: 'categoryId' });
    }
  }
  ProductCategory.init(
    {
      productId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'products', key: 'id' },
      },
      categoryId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'categories', key: 'id' },
      },
    },
    {
      sequelize,
      modelName: 'ProductCategory',
      tableName: 'product_categories',
    }
  );
  return ProductCategory;
};