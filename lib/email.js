
var nodemailer = require('nodemailer');
var EmailTemplate = require('email-templates').EmailTemplate;
var path = require('path');
var xoauth2 = require("xoauth2");

var emailData = require('../config.js').emailData;
var emailSmtp = require('../config.js').EMAIL_SMTP;
var	emailDirect = require('../config.js').EMAIL_DIRECT;

var templatesDir = path.resolve(__dirname, '../views', 'email-templates');


//SMTP Direct method, 
if(emailDirect){
	// create reusable transporter object using the default SMTP transport 
	var transporter = nodemailer.createTransport();
}

//XOAuth2 Gmail method, 
if(emailSmtp){
	// create reusable transporter object using the default SMTP transport 
	var transporter = nodemailer.createTransport({
	    service: 'gmail',
	    auth: {
	        xoauth2: xoauth2.createXOAuth2Generator({
			 	user: 'animepowa@gmail.com',
			    clientId: '821389806220-uo0r4flci31ogt1d9djlbek4q8gutmgu.apps.googleusercontent.com',
			    clientSecret: 'By-FS0MAgB3sRHq1FhOKlrAQ',
			    refreshToken: '1/P9Wd_Q0CctxkMPt-pcspMyA9FPOUhIoLLaTvW6Ouyf0MEudVrK5jSpoR30zcRFq6',
			    // accessToken: 'ya29..uALeKzNiqE52_9u_KoahXes8-ytRZ0k7i87poUKp7oSQgOAjm_ljGdIaWWa-QME3CA',
			    customHeaders: {
			      "HeaderName": "HeaderValue"
			    },
			    customPayload: {
			      "payloadParamName": "payloadValue"
			    }
			})
	    }
	});
}

// Verifica si la conexion XOAuth es correcta
transporter.verify(function(error, success) {
   if (error) {
        console.log(error);
   } else {
        console.log('Nodemailer connection READY!');
   }
});

function Email (){

	return{

		send : function (to, subject, name, emailTemplate, data){

			var template = new EmailTemplate(path.join(templatesDir, emailTemplate ));
			var locals = {
				baseURL:data.baseURL,
		    	activationHash: data.activationHash,
		    	registerConfirmation: data.registerConfirmation,		
			  	email: to,
			 	name: {
				    first: name,
				    last: '!',   
			  	}
			};

			// Send a single email
			template.render(locals, function (err, results) {
			  if (err) {
			    return console.error(err);
			  }

			  transporter.sendMail({
			    from: 'App#1 <the_numberOne@App#1.com>',
			    to: locals.email,
			    subject: subject,
			    html: results.html,
			    text: results.text
			  }, function (err, responseStatus) {
			    if (err) {
			      return console.error(err);
			    }
			    console.log(responseStatus.response);
			  });
			});
		},

		sendRegister : function(data){
			//console.log (data);
			var subject;
			if(data.registerConfirmation){
				subject = 'Complete your registration!';
				this.send(data.email, subject, data.displayName, 'registration-confirm',data);
			}else{
				subject = 'Welcome!';
				this.send(data.email, subject, data.displayName, 'registration-confirm',data);				
			}
		},
		sendRecoveryPassword : function(){},
	};
}	

module.exports = Email;	
