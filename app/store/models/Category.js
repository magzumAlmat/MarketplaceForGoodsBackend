// src/models/Category.js
'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Category extends Model {
    static associate(models) {
      Category.belongsToMany(models.Product, {
        through: models.ProductCategory,
        foreignKey: 'categoryId',
        otherKey: 'productId',
        as: 'products',
      });
    }
  }
  Category.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
    },
    {
      sequelize,
      modelName: 'Category',
      tableName: 'categories',
    }
  );
  return Category;
};