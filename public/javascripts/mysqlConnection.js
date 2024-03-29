// Define and Import the variables
const mysql = require('mysql');
const databaseName = 'sample';
const hotelInfo = 'hotelInfo';
const userInfo = 'userInfo';
const reserveInfo = 'reserveInfo';

// Create Connection
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'stm12345' // depends to the user
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
connection.query('CREATE DATABASE IF NOT EXISTS ??;', databaseName);
connection.query('USE ??;', databaseName);
connection.query('CREATE TABLE IF NOT EXISTS ??(id INT AUTO_INCREMENT PRIMARY KEY NOT NULL, name TEXT, lat TEXT, lng TEXT, url TEXT, fromBusTime TEXT, toBusTime TEXT, regHoliday TEXT, reservationInfo TEXT, userId TEXT, delFlg TINYINT(1));', hotelInfo);
// connection.query('ALTER TABLE ?? ADD fromBusTime TEXT AFTER url, ADD toBusTime TEXT AFTER fromBusTime;', tableName);
connection.query('CREATE TABLE IF NOT EXISTS ??(id INT AUTO_INCREMENT PRIMARY KEY NOT NULL, userName TEXT, loginId TEXT, password TEXT, contact TEXT, userId TEXT, role TEXT, lastLoginDate DATETIME);', userInfo);
connection.query('CREATE TABLE IF NOT EXISTS ??(id INT AUTO_INCREMENT PRIMARY KEY NOT NULL, hotelId TEXT, hotelName TEXT, userId TEXT, userName TEXT, contact TEXT, reserveDate TEXT, timeNum TINYINT, reserveTime TEXT, roomVal TEXT, oldFlg TINYINT(1), cancelFlg TINYINT(1), 登録日時 DATETIME);', reserveInfo);
// connection.query('ALTER TABLE ?? ADD contact TEXT AFTER password;', userInfo);

connection.query('SHOW FIELDS FROM ??;', hotelInfo, (error, response) => {
    console.log(response);
});

connection.query('SHOW FIELDS FROM ??;', userInfo, (error, response) => {
    console.log(response);
});

connection.query('SHOW FIELDS FROM ??;', reserveInfo, (error, response) => {
    console.log(response);
});

// Export Connection
module.exports = connection;