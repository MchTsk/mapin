var express = require('express');
var router = express.Router();

// Require mysqlConnection
const connection = require('../public/javascripts/mysqlConnection');

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
    } else {
      console.log('Delete Success');
      // res.render('delete', {title: '削除完了'});
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
    } else {
      console.log('Read Success');
      res.render('delete', {
        title: '全削除',
        maps: response
      });
    }
    return;
  });
}

module.exports = router;