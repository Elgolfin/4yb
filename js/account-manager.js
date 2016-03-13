/* global db_4yb */
"use strict";
const alphabet = require('./alphabet.js').alphabet;

let AccountManager = exports.AccountManager = function (db) {
    this.db = db;
    return this;
}

AccountManager.prototype.getAll = function () {
    let callback = function () { }, getAccounts = alphabet.buildTreeList;
    let numArgs = arguments.length;
    if (numArgs == 1) {
        callback = arguments[0];
    }
    if (numArgs > 1) {
        getAccounts = arguments[0];
        callback = arguments[1];
    }
    
    this.db.findAsync({ entity: "account", path: /^a\./ }).sort({ name: 1 }).execAsync().then(function (docs) {
        let accountsTree = getAccounts("a", JSON.parse(JSON.stringify(docs)));
        callback(accountsTree);
    });
}


AccountManager.prototype.getAll_FlatList = function (callback) {
    AccountManager.prototype.getAll.call(this, alphabet.buildFlatList, function(accounts){
        callback(accounts);
    });
}

AccountManager.prototype.getAll_TreeList = function (callback) {
    AccountManager.prototype.getAll.call(this, alphabet.buildTreeList, function(accounts){
        callback(accounts);
    });
}