const { DataTypes } = require('sequelize');
const sequelize = require('../../../config/db');
const Order = require('./Order');
const Product = require('./Product');

const OrderProduct = sequelize.define('OrderProduct', {
  orderId: {
    type: DataTypes.INTEGER,
    references: {
      model: Order,
      key: 'id',
    },
    allowNull: false,
  },
  productId: {
    type: DataTypes.INTEGER,
    references: {
      model: Product,
      key: 'id',
    },
    allowNull: false,
  },
  count: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
  },
}, {
  timestamps: false,
  tableName: 'order_products',
});

// Определение связей
Order.belongsToMany(Product, { through: OrderProduct, foreignKey: 'orderId' });
Product.belongsToMany(Order, { through: OrderProduct, foreignKey: 'productId' });

Order.hasMany(OrderProduct, { foreignKey: 'orderId' });
OrderProduct.belongsTo(Order, { foreignKey: 'orderId' });

Product.hasMany(OrderProduct, { foreignKey: 'productId' });
OrderProduct.belongsTo(Product, { foreignKey: 'productId' });

module.exports = OrderProduct;