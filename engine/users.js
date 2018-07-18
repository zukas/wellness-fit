"use strict";

var db = require("../db"),
	hasher = require('password-hash');

exports.login = function (user) {
	logger.log("User login", user);
	return new Promise((resolve, reject) => {
		db.db.users.findOne({ _id : user.username }, { password : 1 }, function (err, res) {
			if(err || !res) {
				resolve({status : false});
			} else {
				resolve({ status : hasher.verify(user.password, res.password) });
			}
		});
	});
}