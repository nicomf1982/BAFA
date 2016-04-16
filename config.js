
//var mongojs = require('mongojs');


var env = process.env.NODE_ENV !== 'production';

if(env){
    //development export NODE_ENV=development
    console.log(process.env.NODE_ENV+' mode READY!');
	// var mongoURL = 'mongodb://localhost:27017/bafa';
	// var db = mongojs(mongoURL, ['users','games']);
	// db.users=db.collection('users');
	// db.games=db.collection('games');
	var db = 'mongodb://localhost:27017/bafa';

}else{
	//production export NODE_ENV=production
	console.log(process.env.NODE_ENV+' mode');
	// var mongoURL = 'mongodb://localhost:27017/bafa';
	// var db = mongojs(mongoURL, ['users','games']);
	// db.users=db.collection('users');
	// db.games=db.collection('games');
	var db = 'mongodb://localhost:27017/bafa';

}

var cryptoSecret = 'USE.YOUR.OWN';

// Advice on each DB connection
// db.on('connect', function () {
//   console.log('database connected');
// });

module.exports = {
	'db': db,
	'cryptoSecret': cryptoSecret,
	'emailData': {
		//templatesPath: path.join(__dirname, 'views/emails'),
		from: "MVP <mvp@example.com>",
		replyTo: "MVP <mvp@example.com>",
		proyectName: "MVP",
		contactEmail: "MVP <mvp@example.com>"
	},
	REGISTER_CONFIRMATION: true,
	EMAIL_DIRECT: false, // Easier to set up but has higher chances of ending up in the Spam folder
	EMAIL_SMTP: true, // ussing OXAuth2 on gmail, Mailgun , Mandrill
};