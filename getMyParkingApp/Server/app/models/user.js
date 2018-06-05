// app/models/user.js

// load mongoose since we need it to define a model
var mongoose = require('mongoose');

// creating user model with thiere attributres
var user = mongoose.model('User', {
	name: String,
    email : String,
    password : String
});

module.exports = user;