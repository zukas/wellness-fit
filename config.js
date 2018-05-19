
var cfg = {
	ssl : false,
	privateKey: "/etc/letsencrypt/live/@set@/privkey.pem",
	publicKey: "/etc/letsencrypt/live/@set@/cert.pem",
	chainKey: "/etc/letsencrypt/live/@set@/chain.pem",
	logging: true,
	debug: true,
	domain: "http://localhost:8080",
	master: "julius.zukauskas@gmx.com",
	db : {
		server: "localhost",
		port: 27017,
		name: "electrogym-fit"
	},
	ses : {
		accessKeyId : "@set@",
		secretAccessKey: "@set@",
		region: "eu-west-1",
		rateLimit: 1
	},
	mailSender : "@set@",
	paypal: {
		mode: "@set@", //sandbox or live
		client_id: "@set@",
		client_secret: "@set@"
	},
	google_maps : "",
	session: {
		secure: true,
		secret: ''
	}
}


exports = module.exports = function () {
	return cfg;
}
