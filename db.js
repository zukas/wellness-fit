"use strict";

const 	mongo 	= require("mongodb").MongoClient;
const 	path 	= require('path');
var 	events 	= {};

require("./utils");

exports.db = null;

exports.start = function(info, callback) {
    function updateCollections(db) {
        var create = function(index, list, done) {
            if (index < list.length) {
                db.createCollection(list[index], {}, function(err2, collection) {
                    if (err2) throw err2;
                    exports.db[list[index]] = collection;
                    async(create, index + 1, list, done);
                });
            } else {
                async(done);
            }
        };
        async(create, 0, info.collections, function() {
            async(callback);
            callback = null;
            for (var i in events['started'] || []) {
                async(events.started[i]);
            }
        });
    }

    if (exports.db == null) {
    	
        mongo.connect(format(
        	"mongodb://%s:%d",
        	info.db.server,
        	info.db.port
        ), function(err, client) {
        	var db = client.db(info.db.name);
        	exports.db = db;
        	updateCollections(db);
        });

    }
};

exports.on = function(event, callback) {
    if (typeof event === 'string' && typeof callback === 'function') {
        events[event] = events[event] || [];
        events[event].push(callback);
    } else {
        throw 'Event and/or callback missmatch - event type: ' + (typeof event) + ', value: ' + event + ', callback type: ' + (typeof callback);
    }
};