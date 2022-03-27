// Define and Import the variables
const mysql = require('mysql');
// const databaseName = 'sample';
const tableName = 'hotelInfo';

// Create Connection
const connection = mysql.createConnection({
    // host: 'localhost',
    // user: 'root',
    // password: 'stm12345' // depends to the user
    host: 'us-cdbr-east-05.cleardb.net',
    user: 'b4c5c4bf80a021',
    password: 'a17bb3ab',
    database: 'heroku_5d18b8e52016aca'
});

// Connect Function
connection.connect((error) => {
    if (error) {
        console.error('Database Connect Error:' + error);
        return;
    } else {
        console.log('Database Connection Success: id=' + connection.threadId);
    }
});

// Initializing Database
// connection.query('CREATE DATABASE IF NOT EXISTS ??;', databaseName);
// connection.query('USE ??;', databaseName);
connection.query('CREATE TABLE IF NOT EXISTS ??(id INT AUTO_INCREMENT PRIMARY KEY NOT NULL, name TEXT, lat TEXT, lng TEXT, url TEXT);', tableName);
connection.query('SHOW FIELDS FROM ??;', tableName, (error, response) => {
    console.log(response);
});

// Export Connection
module.exports = connection;