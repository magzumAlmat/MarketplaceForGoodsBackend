// src/models/Order.js
'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    static associate(models) {
      // Если нужна связь с пользователем, добавь belongsTo
    }
  }
  Order.init(
    {
      product_ids: {
        type: DataTypes.ARRAY(DataTypes.ARRAY(DataTypes.INTEGER)),
        allowNull: true,
      },
      username: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      address: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      phone: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      status: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      totalPrice: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false, // Предполагаем связь с пользователем
      },
    },
    {
      sequelize,
      modelName: 'Order',
      tableName: 'Orders',
    }
  );
  return Order;
};