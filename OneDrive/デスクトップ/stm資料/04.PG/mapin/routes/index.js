var express = require('express');
var router = express.Router();

// Require mysqlConnection
const connection = require('../public/javascripts/mysqlConnection');

/* GET index page. */
router.get('/', function (req, res, next) {
  indexRender(res);
});

/* Render Function */
const indexRender = (res) => {
  connection.query('SELECT name, lat, lng, url FROM hotelInfo ORDER BY ID ASC;', (error, response) => {
    if (error) {
      console.error('Read Error:' + error);
    } else {
      console.log('Read Success');
      res.render('index', {
        title: 'mapin',
        values: response
      });
    }
    return;
  });
}

module.exports = router;