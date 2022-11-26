// Define and Import the variables
const mysql = require('mysql');
// const databaseName = 'sample';
const tableName = 'hotelInfo';

// Create Connection
const pool = mysql.createPool({
    // host: 'localhost',
    // user: 'root',
    // password: 'stm12345' // depends to the user
    host: 'us-cdbr-east-05.cleardb.net',
    user: 'bbd2d6e4b41d86',
    password: '773fca6d',
    database: 'heroku_93d37b1e950623e'
});

pool.getConnection(function(err, connection){
    connection.query('CREATE TABLE IF NOT EXISTS hotelInfo(id INT AUTO_INCREMENT PRIMARY KEY NOT NULL, name TEXT, lat TEXT, lng TEXT, url TEXT);', function(err, rows, fields){
        if(err){
            console.error('Database Connect Error:' + error);
            throw err;
        } else {
            console.log('Database Connection Success');
        }
    });
});

// Export Connection
module.exports = pool;