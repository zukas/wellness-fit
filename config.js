
var cfg = {
	ssl : true,
	privateKey: "/etc/letsencrypt/live/wellness-fit/privkey.pem",
	publicKey: "/etc/letsencrypt/live/wellness-fit/cert.pem",
	chainKey: "/etc/letsencrypt/live/wellness-fit/chain.pem",
	logging: true,
	debug: false,
	domain: "https://wellness-fit.pl",
	master: "julius.zukauskas@gmx.com",
	db : {
		server: "localhost",
		port: 27017,
		name: "electrogym-fit"
	},
	google_maps : "",
	session: {
		secure: false,
		secret: ''
	}
}


exports = module.exports = function () {
	return cfg;
}
