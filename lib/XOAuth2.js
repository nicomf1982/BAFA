
var xoauth2 = require("xoauth2");
var xoauth2gen;


xoauth2gen = xoauth2.createXOAuth2Generator({
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
});

// SMTP/IMAP
xoauth2gen.getToken(function(err, token){
    if(err){
        return console.log(err);
    }
    console.log("AUTH XOAUTH2 " + token);
});

// HTTP
xoauth2gen.getToken(function(err, token, accessToken){
    if(err){
        return console.log(err);
    }
    console.log("Authorization: Bearer " + accessToken);
});

// listen for token updates (if refreshToken is set) 
// you probably want to store these to a db 
xoauth2gen.on("token", function(token){
    console.log("User: ", token.user); // e-mail address
    console.log("New access token: ", token.accessToken);
    console.log("New access token timeout: ", token.timeout); // TTL in seconds
});