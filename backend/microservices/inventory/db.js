const mysql = require('mysql2');

const pool = mysql.createPool({
  host: 'localhost', // Replace with your MySQL host
  user: 'nagesh', // Replace with your MySQL user
  password: 'Qwerty1234!', // Replace with your MySQL password
  database: 'shopify_products' // Replace with your MySQL database name
});

module.exports = pool.promise();