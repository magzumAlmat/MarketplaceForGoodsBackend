const { DataTypes } = require('sequelize');
const sequelize = require('../../../config/db')

const Order = sequelize.define('Order', {

 
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
        allowNull: false
    },
    totalPrice: {
        type: DataTypes.DECIMAL(10, 2), // Для поддержки дробных чисел
        allowNull: false,
    },
}, {
    timestamps: true, // Добавим временные метки для отслеживания
    tableName: 'orders',
});

module.exports = Order;