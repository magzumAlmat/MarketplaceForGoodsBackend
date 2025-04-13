const { DataTypes } = require("sequelize");
const sequelize = require("../../../config/db");
const Cart = require("./Order");

const Product = sequelize.define("Product", {
  // src/models/Product.js
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
  volume: {
    type: DataTypes.STRING, // Например: "50/200/350/750 мл", "54 шт", "150 г"
    allowNull: true,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  features: {
    type: DataTypes.TEXT, // Особенности, например: "97% натуральных ингредиентов"
    allowNull: true,
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      min: 0,
    },
  },
  stock: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    validate: {
      min: 0,
    },
  },
}, {
  timestamps: true,
  tableName: 'products',
});

module.exports = Product;