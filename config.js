
var mongojs = require('mongojs');
var mongoURL = 'mongodb://localhost:27017/bafa';
var db = mongojs(mongoURL, ['users','games']);
		db.users=db.collection('users');
		db.games=db.collection('games');

db.on('connect', function () {
  console.log('database connected');
});

module.exports = {
	db: db
};