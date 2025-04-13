// src/models/ProductImage.js
'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class ProductImage extends Model {
    static associate(models) {
      ProductImage.belongsTo(models.Product, { foreignKey: 'productId' });
    }
  }
  ProductImage.init(
    {
      productId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'products', key: 'id' },
      },
      imagePath: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      isPrimary: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
    },
    {
      sequelize,
      modelName: 'ProductImage',
      tableName: 'product_images',
    }
  );
  return ProductImage;
};