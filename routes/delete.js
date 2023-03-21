var express = require('express');
var router = express.Router();

// Require mysqlConnection
// const connection = require('../public/javascripts/mysqlConnection');
const connection = require('../db/pool');

/* GET index page. */
router.get('/', function (req, res, next) {
  deleteRender(res);
});

/* POST new todo. */
router.post('/', function (req, res, next) {
  console.log('DELETE...!!');

  connection.query('DELETE FROM hotelInfo;', (error, response) => {
    if (error) {
      console.error('Delete Error:' + error);
      res.render('error', {});
    } else {
      console.log('Delete Success');
      deleteRender(res);
    }
    return;
  });
});

/* Render Function */
const deleteRender = (res) => {
  connection.query('SELECT name,lat,lng,url FROM hotelInfo ORDER BY ID ASC;', (error, response) => {
    if (error) {
      console.error('Read Error:' + error);
      res.render('error', {});
    } else {
      console.log('Read Success');
      res.render('delete', {
        title: '全削除',
        maps: response.rows
      });
    }
    return;
  });
}

module.exports = router;