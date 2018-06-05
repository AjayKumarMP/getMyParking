
// load mongoose since we need it to define a model
var mongoose = require('mongoose');

var Token = mongoose.model('Token',{
	token: String,
	time: Date,
	userEmailId: String,
	done: Boolean
});

module.exports = Token;