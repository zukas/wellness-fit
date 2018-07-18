"use strict";

var db 			= require("../db"),
	ObjectID 	= require('mongodb').ObjectID;


exports.setText = function (data) {
	logger.log("Home setText", data);
	return new Promise((resolve, reject) => {
		db.db.home.save({ _id : 0, text: data.text }, { w: 1 }, function (err, res) {
			if (err) {
				resolve({status: false, error: err});
			} else {
				resolve({status:true});
			}
		});
	});
}


exports.getText = async function () {
	logger.log("Home getText");
	return new Promise((resolve, reject) => {
		db.db.home.findOne({_id:0},{text: 1}, function (err, res) {
			if (err) {
				resolve({status : false, error: err});
			} else {
				resolve({status : true, text: res.text});
			}
		});
	});
}