
const config = require('config');
var xoauth2 = require("xoauth2");
var xoauth2gen;


xoauth2gen = xoauth2.createXOAuth2Generator(config.get('xoauthOptions'));

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
