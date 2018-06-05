var User = require('./../models/user');
var Token = require('./../models/token');


// method to register a new user
// only register if user is not yet registered by checking his email id
var register = (req, res) => {
	User.find({email: req.body.email},(err, user)=>{
		if(err){
			res.status(500).send(err);
		}
		if(user.length > 0){
			console.log(user);
			res.status(500).send("User already exists:"+req.body.email);
		}else {
			if(req.body.password.length < 8){
				res.status(500).send("Password should be minimum of 8 charcaters");
			}else{
				User.create({
					name: req.body.name,
					email: req.body.email,
					password: req.body.password
				},(err, user)=>{
					
					if(err){
						res.staus(500).send("Error in creating user"+req.body.name);
						console.log("UserApi: register(): Error in creating user"+req.body.name +"Error is:"+err);
					}
					res.status(200).json(user);
				});
			}
		}
	});
}

// method to login an user
// check his credentials are matching in the database {email, password}
var login = (req, res) => {
	User.find({email:req.body.email, password: req.body.password}, (err, user) => {
		if(err){
			res.status(500).send(err);
			console.log("UserApi: login(): "+req.body.email +"Error is:"+err);
		}
		if(user.length == 0){
			res.status(500).send("Given email_id is not yet registered or mispelled");
		}else{
			res.status(200).json(user);
		}

	})
}

var forgotPassword = (req, res)=>{
	User.find({email: req.body.email}, (err, user) => {
		if(err){
			res.status(500).send(err);
			console.log("UserApi: forgotPassword(): "+req.body.email +"Error is:"+err);
		}
		if(user.length == 0){
			res.status(500).send("Given email_id is not yet registered or mispelled");
		}else{
			var genToken = generateToken();
			Token.create({
				token: genToken,
				time: new Date(),
				userEmailId: req.body.email,
				done: false
			}, (err, token)=>{
				if(err){
					res.status(500).send(err);
					console.log("UserApi: forgotPassword(): "+req.body.email +"Error is:"+err);
				}
				res.json(getUrl()+genToken)
			})
		}
	});
}

// method to retrieve the forgotton password
// check the entered mail id is registered if so then 
// create a new random passwrod and send to user
var resetPassword = (req, res) => {
	Token.find({token: req.query.token, done: false}, (err, token)=>{
		if(err){
			res.status(500).send(err);
			console.log("UserApi: resetPassword(): "+req.body.email +"Error is:"+err);
		}
		if(token.length == 0){ 
			res.status(500).send("token is not valid");
			console.log("UserApi: resetPassword(): "+req.body.email +"un Identified token");
		}else{
			var endtime = new Date();
			console.log("token[0].time.getHours():"+(token[0].time.getTime() - endtime.getTime()));
			console.log("token[0].time.getMinutes()"+token[0].time.getMinutes());
			
			if((token[0].time.getTime() - endtime.getTime()) > 1 || 
				((token[0].time.getTime() - endtime.getTime()) == 1 && token[0].time.getMinutes() > 0)){
				res.send("Sorry, Token is out dated");
			}else if(token[0].userEmailId != req.body.email){
				res.send("User mail id mismtach with the token");
			}else{
					User.find({email: req.body.email}, (err, user) => {
					if(err){
						res.status(500).send(err);
						console.log("UserApi: resetPassword(): "+req.body.email +"Error is:"+err);
					}
					if(user.length == 0){
						res.status(500).send("Given email_id is not yet registered or mispelled");
					}
					var new_password = Math.random().toString(36).substr(2, 8);
					console.log(new_password);
					user[0].password = new_password;
					console.log(user[0]._id);
					User.findByIdAndUpdate(user[0]._id, user[0], {new: true}, (err, updated_user) => {
						if(err){
							res.status(500).send(err);
							console.log("UserApi: resetPassword(): "+req.body.email +"Error is:"+err);
						}
						token[0].done = true;
						Token.findByIdAndUpdate(token[0]._id, token[0], (err, token)=>{
							if(err){
								res.status(500).send(err);
								console.log("UserApi: resetPassword(): "+req.body.email +"Error is:"+err);
							}
							res.status(200).json(updated_user);
						});
						
					});
					
				});	
			}
		}
	});


	
}

var generateToken = ()=>{
	return Math.random().toString(36).substr(2, 12);
}

var getUrl = ()=>{
	var host ="localhost";
	var port = "8888";
	return "http://"+host+":"+port+"/user/resetPassword?token=";
}

module.exports.register = register;
module.exports.login = login;
module.exports.forgotPassword = forgotPassword;
module.exports.resetPassword = resetPassword;