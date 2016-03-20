var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'BAFA' });
});


/* POST home page. */
router.post('/login', function(req, res, next) {
  console.log(req.body);
  
  if(req.body.name==='nicolas'){ res.send(true);}
  else{
  res.send (false);}
});

module.exports = router;
