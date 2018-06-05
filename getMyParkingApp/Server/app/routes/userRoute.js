var user_routes = require('./../controllers/userApi');

var userRouter = (app)=>{

	// post method for login an user
	// parameters user obejct in request body
	app.post('/user/login', user_routes.login);

	// post method for registering an new user
	// parameters user obejct in request body
	app.post('/user/register', user_routes.register);

	// post method for forgotPassword for a user
	// parameters emailid of an user obejct in request body
	app.post('/user/forgotPassword', user_routes.forgotPassword);

	// post method for resetPassword for a user
	// parameters emailid, token and password of an user obejct in request body
	app.post('/user/resetPassword', user_routes.resetPassword);
}

module.exports = userRouter;