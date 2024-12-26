const mysql = require('mysql2');

const pool = mysql.createPool({
  host: 'localhost', // Replace with your MySQL host
  port: 3306, // Replace with your MySQL port
  user: 'nagesh', // Replace with your MySQL user
  password: 'Qwerty1234!', // Replace with your MySQL password
  database: 'shopify' // Replace with your MySQL database name
});

pool.getConnection((err, connection) => {
  if (err) {
    console.error('Error connecting to the database:', err.message);
  } else {
    console.log(`Connected to the database ${connection.config.database}`);
    connection.release();
  }
});

pool.on('end', () => {
  console.log('Disconnected from the database');
});

module.exports = pool.promise();