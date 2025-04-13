const { Sequelize } =require('sequelize');

const sequelize = new Sequelize({
  dialect: 'postgres',
  host: 'localhost',
  port: 5432,
  username: "admin",
  password: "root",
  database: "admin",


  logging: false,
});

module.exports = sequelize;