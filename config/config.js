const fs = require("fs");
module.exports = {
  development: {
    username: "admin",
    password: "root",
    database: "admin",
    host: "localhost",
    dialect: "postgres",
  },

  production: {
    username:'doadmin',
    password:'AVNS_7griogjZIb7dbTscTAV',
    database:'defaultdb',
    host:'db-postgresql-sgp1-marketplace-do-user-15552454-0.c.db.ondigitalocean.com',
    dialect:'postgres',
    port:25060,
    dialectOptions: {
        ssl: {
          ca: fs.readFileSync('config/ca-certificate.crt')
        },
    },
  },
};
