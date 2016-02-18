"use strict";
const PromiseDatastore = require('./nedb.promises.js').PromiseDatastore;

let db4yb = exports.Db4yb = function() {
    this.Datastore = "test";
    return this;
}

db4yb.prototype.get = function() {
    return this;
}

db4yb.prototype.load = function(filepath) {
    if (typeof filepath === 'string') {
        this.Datastore = new PromiseDatastore({ filename: filepath, autoload: true, timestampData: true });
    }
    else { // in-memory
        this.Datastore = new PromiseDatastore();
    }
    return this;
}

db4yb.prototype.close = function() {
    this.Datastore.loadDatabase(function(){
        this.Datastore = null;
    });
    return this;
}