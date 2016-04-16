var mongoose = require("mongoose");

var userSchema = new mongoose.Schema({
    id: {type: String},
    provider:{ type: String },
    enable:{ type: Boolean },
    activationHash: { type: String },
    displayName: { type: String },
    name: {familyName: { type: String}, middleName: { type: String}, givenName: { type: String}},
    username: { type: String },
    email: { type: String },
    pass: { type: String },
    legals: { type: String, enum: [true, false] },
    creationDate: { type: Date}
  
});


module.exports = mongoose.model('user', userSchema);