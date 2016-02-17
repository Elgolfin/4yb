/* global db_4yb */ 
"use strict";
const alphabet = require('./alphabet.js').alphabet;
const PromiseDatastore = require('./nedb.promises.js').PromiseDatastore;
const db = new PromiseDatastore({ filename: "test.db.json", autoload: true });

let Account = exports.Account = function() {
    this._id = "";
    this.name = "";
    this.code = "";
    this.type = "";
    this.path = "";
    this.parent = "";
    this.description = "";
    this.hidden = "";
    this.placeholder = "";
    this.active = "";
}

Account.prototype.save = function() {
    var callback = function(){}, currentPath;
    var numArgs = arguments.length;
    if (numArgs == 1) {
        callback = arguments[0];
    }
    if (numArgs > 1) {
        currentPath = arguments[0];
        callback = arguments[1];
    }
    if (this.parent !== undefined && this.parent.length > 0) {
        let account = this;
        db.findAsync({parent: account.parent}).sort({ path: -1 }).execAsync().then(function(docs) {
            if (alphabet.getParentPath(currentPath) != account.parent) {
                if (docs.length > 0) {
                    account.path = alphabet.getNextEntry(docs[0].path);
                } else {
                    account.path = account.parent + ".a";
                }
            }
            saveAccount(account, callback);
        })
        /*.catch(function (err) {
            console.log(err);
        })*/;
    } else {
        this._id = db.createNewId();
        this.parent = "a";
        saveAccount(this, callback);       
    }
}

Account.prototype.delete = function() {
    
}

Account.prototype.add = function(callback) {
    return Account.prototype.add(callback);
}

Account.prototype.setName = function(name) {
    this.name = name;
    return this;
}

Account.prototype.load = function (account) {
    this._id = account._id;
    this.name = account.name;
    this.code = account.code;
    this.type = account.type;
    this.path = account.path;
    this.parent = account.parent;
    this.description = account.description;
    this.hidden = account.hidden;
    this.placeholder = account.placeholder;
    this.active = account.active;
    return this;
}

Account.prototype.get = function (id, callback) {
    let account = this;
    db.findOneAsync({_id: id}).execAsync().then(function(doc) {
        if (doc !== null) {
            account.load(doc);
        }
        callback();
    });
}

function saveAccount(account, callback) {
    db.update({ _id: account._id }, account, {upsert: true}, function (err, numReplaced) {
        callback();
    });
}