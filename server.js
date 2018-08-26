"use strict";

process.env.NODE_ENV = "production";
process.env.EXPRESS_ENV = "production";

const config = require('./config')();
const util = require('util');

global.format = util.format;

var express = require('express'),
    favicon = require('serve-favicon'),
    logger = require('morgan'),
    path = require('path'),
    methodOverride = require('method-override'),
    session = require('express-session'),
    ssm = require('connect-mongodb-session')(session),
    bodyParser = require('body-parser'),
    multer = require('multer'),
    nunjucks = require('express-nunjucks'),
    device = require('express-device'),
    errorHandler = require('errorhandler'),
    db = require("./db"),
    app = express(),
    http = require('http'),
    https = require('https'),
    fs = require('fs'),
    forceSSL = require('express-force-ssl'),
    engine = require('./engine'),
    compression = require('compression'),
    server = null,
    secureServer = null,
	session_store = new ssm({
        uri: format(
        	"mongodb://%s:%d/%s",
        	config.db.server,
        	config.db.port,
        	config.db.name
        ),
        collection: 'sessions'
    });

require("./utils");


if (config.logging) {
    enableLog();
}

server = http.createServer(app);
if (config.ssl) {
    var ssl_opt = {
        key: fs.readFileSync(config.privateKey),
        cert: fs.readFileSync(config.publicKey),
        ca: fs.readFileSync(config.chainKey)
    }
    secureServer = https.createServer(ssl_opt, app);
    app.use(forceSSL);
}

// all environments
app.set('port', process.env.PORT || 80);
app.set('views', path.join(__dirname, 'public/views'));
app.set('view engine', 'html');
app.set('view cache', !config.debug);
app.use(compression());
app.use(favicon(__dirname + '/public/favicons/favicon.ico'));
app.use(multer({ storage: multer.memoryStorage() }).any());
app.use(methodOverride());
app.use(session({
    store: session_store,
    resave: true,
    saveUninitialized: true,
    domain: config.domain,
    secure: config.session.secure,
    secret: config.session.secret,
    sameSite: true
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(device.capture());
app.use(engine.session_update);

const njk = nunjucks(app, {
    watch: config.debug,
    noCache: config.debug
});

engine.track_sessions(session_store);
engine.system_updates();

app.get('/', engine.index);


app.get('*', function(req, res) {
    res.redirect('/');
});
db.start({
    db: config.db,
    collections: [
    ]
}, function() {
    if (secureServer) {
        secureServer.listen(443)
    }
    server.listen(app.get("port"));
});