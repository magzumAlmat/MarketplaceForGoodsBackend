const { Client } = require('pg');
const config = require('./config/config.js');

async function checkSchema() {
  const client = new Client({
    user: config.development.username,
    host: config.development.host,
    database: config.development.database,
    password: config.development.password,
    port: config.development.port || 5432,
    ssl: config.development.dialectOptions ? config.development.dialectOptions.ssl : false,
  });

  try {
    await client.connect();
    const res = await client.query(`
      SELECT column_name
      FROM information_schema.columns
      WHERE table_name = 'products';
    `);
    console.log('Columns in products table:', res.rows);
  } catch (err) {
    console.error('Error querying database:', err);
  } finally {
    await client.end();
  }
}

checkSchema();
