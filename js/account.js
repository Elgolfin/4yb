/* global db_4yb */
"use strict";
const alphabet = require('./alphabet.js').alphabet;

let Account = exports.Account = function (db) {
    this.db = db;
    this._id = null;
    this.name = null;
    this.code = null;
    this.type = null;
    this.path = null;
    this.parent = null;
    this.description = null;
    this.hidden = null;
    this.placeholder = null;
    this.active = null;
}

Account.prototype.save = function () {
    let callback = function () { }, currentPath;
    let numArgs = arguments.length;
    if (numArgs == 1) {
        callback = arguments[0];
    }
    if (numArgs > 1) {
        currentPath = arguments[0];
        callback = arguments[1];
    }
    
    if (!this.parent) {
        this.parent = 'a';
    }
    if (!this._id) {
        this._id = this.db.createNewId();
    }
    
    let account = this;
    this.db.findAsync({ entity: "account", parent: account.parent }).sort({ path: -1 }).execAsync().then(function (docs) {
        if (alphabet.getParentPath(currentPath) != account.parent) {
            if (docs.length > 0) {
                account.path = alphabet.getNextEntry(docs[0].path);
            } else {
                account.path = account.parent + ".a";
            }
        }
        saveAccount(account, callback);
    });
}

Account.prototype.delete = function () {

}

Account.prototype.add = function (callback) {
    return Account.prototype.save(callback);
}

Account.prototype.setName = function (name) {
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
    this.db.findOneAsync({ _id: id }).execAsync().then(function (doc) {
        if (doc !== null) {
            account.load(doc);
        }
        callback();
    });
}

Account.prototype.JSONify = function () {
    return {
        _id: this._id,
        name: this.name,
        code: this.code,
        type: this.type,
        path: this.path,
        parent: this.parent,
        description: this.description,
        hidden: this.hidden,
        placeholder: this.placeholder,
        active: this.active,
        entity: "account"
    }
}

function saveAccount(account, callback) {
    const accountToBeSaved = account.JSONify();
    account.db.update({ _id: account._id }, accountToBeSaved, { upsert: true }, function (err, numReplaced) {
        if (err) { throw err; }
        callback();
    });
}