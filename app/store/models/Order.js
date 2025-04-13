const { DataTypes } = require('sequelize');
const sequelize = require('../../../config/db')

const Order = sequelize.define('Order', {

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
        allowNull: false
    },
    totalPrice: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
});

module.exports = Order;