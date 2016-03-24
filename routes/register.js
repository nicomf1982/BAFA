var express = require('express');
var router = express.Router();
//lib para manejar los registros de usuarios

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('register', {title:'registro'});
});

/* POST users listing. */
router.post('/', function(req, res, next) {
	console.log(req.body);
  res.send(true);
});

module.exports = router;
