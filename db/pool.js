// Define and Import the variables
const { Pool } = require("pg");

// DB情報をもったプールを生成
const pool = new Pool({
    host: 'dpg-cgcskre4dad6fr6v3opg-a',
    database: 'mapin_database',
    port: 5432,
    user: 'stm_postgres',
    password: 'f6vs2SsqW84HYc0kNm8ahEhHNFBOtXno',
    // ssl: { 
    //     sslmode: 'require',
    //     rejectUnauthorized: false
    // }
});

pool.query('CREATE TABLE IF NOT EXISTS hotelInfo ("id" SERIAL NOT NULL, "name" TEXT, "lat" TEXT, "lng" TEXT, "url" TEXT, "fromBusTime" TEXT, "toBusTime" TEXT, "regHoliday" TEXT, "reservationInfo" TEXT, "userId" TEXT, "delFlg" SMALLINT, PRIMARY KEY ("id"));');
pool.query('CREATE TABLE IF NOT EXISTS userInfo ("id" SERIAL NOT NULL, "userName" TEXT, "loginId" TEXT, "password" TEXT, "contact" TEXT, "userId" TEXT, "role" TEXT, "lastLoginDate" TIMESTAMP, PRIMARY KEY ("id"));');
pool.query('CREATE TABLE IF NOT EXISTS reserveInfo ("id" SERIAL NOT NULL, "hotelId" TEXT, "hotelName" TEXT, "userId" TEXT, "userName" TEXT, "contact" TEXT, "reserveDate" TEXT, "timeNum" SMALLINT, "reserveTime" TEXT, "roomVal" TEXT, "oldFlg" SMALLINT, "cancelFlg" SMALLINT, "登録日時" TIMESTAMP, PRIMARY KEY ("id"));');

pool.query('SELECT * FROM hotelInfo LIMIT 1;', (error, response) => {
    console.log(response.fields);
});

pool.query('SELECT * FROM userInfo LIMIT 1;', (error, response) => {
    console.log(response.fields);
});

pool.query('SELECT * FROM reserveInfo LIMIT 1;', (error, response) => {
    console.log(response.fields);
});

module.exports = pool;