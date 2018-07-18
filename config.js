
var cfg = {
	ssl : false,
	privateKey: "/etc/letsencrypt/live/wellness-fit/privkey.pem",
	publicKey: "/etc/letsencrypt/live/wellness-fit/cert.pem",
	chainKey: "/etc/letsencrypt/live/wellness-fit/chain.pem",
	logging: true,
	debug: false,
	domain: "http://localhost:8080",
	master: "julius.zukauskas@gmx.com",
	db : {
		server: "localhost",
		port: 27017,
		name: "electrogym-fit"
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
