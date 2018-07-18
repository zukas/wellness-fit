const config = require('./config')();
const util = require('util');

global.format = util.format;

require("./utils");

var db = require("./db"),
    hasher = require('password-hash');

if (process.argv.length != 4) {
    console.log("usage init.js [username] [password]");
} else {
    db.start({
        db: config.db,
        collections: [
            "users",
            "images"
        ]
    }, function() {
        db.db.users.insert({ _id: process.argv[2], password: hasher.generate(process.argv[3]) }, function(err) {
            if (err) {
                console.log(err);
            } else {
                console.log("user " + process.argv[2] + " successfully created");
            }
            process.exit(0);
        })
    });
}