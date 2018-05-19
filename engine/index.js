"use strict";

var check 	= require("./validate"),
	images 	= require("./images"),
	users 	= require("./users"),
	config 	= require("../config")(),
	url 	= require('url'),
	sharp 	= require('sharp'),
	store 	= [];

check.installRegex("ObjectID", /^[\w\d]{24}$/);
check.installRegex("sessionID", /^.{32}$/);
check.installRegex("Name", /^.{2,20}$/);
check.installRegex("Surname", /^.{2,30}$/);
check.installRegex("Address", /^.{5,100}$/);
check.installRegex("Other", /^.{2,50}$/);
check.installRegex("Phone", /^\d{5,14}$/);
check.installRegex("CVV", /^\d{3,4}$/);
check.installRegex("Year", /^\d{4}$/);
check.installRegex("Month", /^\d{1,2}$/);
check.installRegex("Email", /^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i);
check.installConverter("String", "Number", function (value) {
	var res = Number(value);
	if(res == value) {
		return res;
	} else {
		return null;
	}
});

check.installConverter("String", "DateTime", function (value) {

	console.log("String to DateTime:", value);
	return new DateTime().UTC();

});

check.installMod("firstCap", function (data) {
	if(check.classOf(data) == "String" && data.length > 0) {
		data = data.charAt(0).toUpperCase() + data.slice(1);
	}
	return data;
})

exports.system_updates = function() {

	setInterval(function () {

	}, 1800000);
}

exports.index = function(req, res){

	var renderData = req.session.renderData || {};
	var sessionLang = req.session.lang || "pl";
	req.session.renderData = null;

	renderData.desktop = (req.device.type == "desktop");

	if(renderData && config.debug) {
		renderData.debug = true;
	}
	renderData.map_key = config.google_maps; 
	renderData.admin = req.session.admin;
	// renderData.lang = lang.fetch(sessionLang);
	
	res.render("site.html", renderData);
	if (req.session.end) {
		req.session.end = null;
		req.session.destroy();
	}
};


exports.login = function (req, res) {
	if(req.session.admin) {
		res.redirect('/');
	} else {
		res.render("login.html", config.debug ? { debug : true } : null);
	}
}

exports.do_login = function (req, res) {
	users.login(req.body, function (login_res) {
		if(login_res.status) {
			req.session.username = req.body.username;
			req.session.admin = true;
		}
		res.send(login_res);
	});
}

exports.do_logout = function (req, res) {
	req.session.destroy();
	req.session = null;
	res.redirect('/');
}

exports.list_images = function (req, res) {
	if(req.session.admin) {
		images.list_images(function (data) {
			res.send(data);
		});
	} else {
		res.send({ status: false, error: "Not allowed"});
	}
}

exports.load_image = function (req, res) {
	images.load_image({ id : req.params.id }, function (data) {
		var width 	= parseInt(req.query.width),
			height 	= parseInt(req.query.height);
			width = isNaN(width) ? null : width;
			height = isNaN(height) ? null : height;
		sharp(data.buffer)
		.resize(width, height)
			.toBuffer(function(err, buffer) {
			res.writeHead(200, {'Content-Type': data.mimetype, "Cache-Control" : "no-transform,public,max-age=86400" });
			res.end(buffer, 'binary');
			});
	});
}

exports.load_small_image = function (req, res) {

	images.load_image({ id : req.params.id }, function (data) {
		sharp(data.buffer)
		.resize(null, 600)
			.toBuffer(function(err, buffer) {
			res.writeHead(200, {'Content-Type': data.mimetype, "Cache-Control" : "no-transform,public,max-age=86400" });
			res.end(buffer, 'binary');
		});
	});
}

exports.load_thumb_image = function (req, res) {
	images.load_image({ id : req.params.id }, function (data) {
		sharp(data.buffer)
		.resize(null, 300)
			.toBuffer(function(err, buffer) {
			res.writeHead(200, {'Content-Type': data.mimetype, "Cache-Control" : "no-transform,public,max-age=86400" });
			res.end(buffer, 'binary');
			});
	});
}


exports.save_image = function (req, res) {
	if(req.session.admin) {
		images.save_image({ file: req.files.file }, function (data) {
			res.send(data);
		});
	} else {
		res.send({ status: false, error: "Not allowed"});
	}
}

exports.delete_image = function (req, res) {
	if(req.session.admin) {
		images.delete_image(req.body, function (data) {
			res.send(data);
		});
	} else {
		res.send({ status: false, error: "Not allowed"});
	}
}

exports.track_sessions = function (session_store) {
	setInterval(function () {
		for(var i = 0; i < store.length; ++i) {
			(function (session_id) {
				session_store.get(session_id, function (err, session) {
					if(session){
						if(session.valid && !session.admin) {
							var current 	= new Date(),
								valid 		= new Date(session.valid.getTime() + 15 * 60000);
							if(valid < current) {
								session_store.destroy(session_id);
								
							}
						}
					} else if(!err) {
						var idx = store.indexOf(session_id);
						if(idx >= 0) {
							store.splice(idx, 1);
						}
							
					}
				});
			})(store[i])
		}
	}, 30000);
}

exports.session_update = function (req, res, next) {
	if(req.session) {
		if(!req.session.created) {
			req.session.created = new Date();
			store.push(req.sessionID);
		}
		req.session.valid = new Date();
	}
	next();
}


exports.order_process = function (req, res) {
	var data = {
		sessionID : req.sessionID,
		accept: config.domain + "/async/paypal/accept",
		cancel: config.domain + "/async/paypal/cancel"
	};
	orders.approve(data, function (result) {
		if(result.status) {
			res.redirect(result.link);
		} else {
			res.send(result);
		}
	});
}