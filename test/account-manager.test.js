/* global describe, it, before, after, expect */ 
"use strict";
const assert = require('chai').assert;
const AccountManager = require('../js/account-manager.js').AccountManager;
const Db4yb = require('../js/4yb-database.js').Db4yb;
const jetpack = require('fs-jetpack').cwd('./test/');

let db_4yb;
let testData = jetpack.read('./account-manager.test.data.json', 'jsonWithDates');
        
describe('Account Manager', function() {
    
    before('Create the in-memory nedb', function (done) {
        db_4yb = new Db4yb().load().Datastore; // db in-memory
        //db_4yb = new Db4yb().load('test.db.' + (new Date).getTime() + '.json').Datastore; // db file
        
        db_4yb.insert(testData, function (err, newDoc) {
            done();
        });
    });
    
    after('', function (done) {
        db_4yb.loadDatabase(function() {
            done();
        });
    });
    
    describe('Account Get', function() {
        
        it('returns all accounts (50)', function() {
            let accountManager = new AccountManager(db_4yb);
            accountManager.getAll_Default(function(accounts){
                assert.strictEqual(accounts.length, 65);
            });
        });
        
        it('returns expense and income accounts only (10 + 40)', function() {
            let accountManager = new AccountManager(db_4yb);
            accountManager.accountType = ['INC', 'EXP'];
            accountManager.getAll_Default(function(accounts){
                assert.strictEqual(accounts.length, 10 + 40);
            });
        });
        
        it('returns all accounts in an hashtable', function() {
            let accountManager = new AccountManager(db_4yb);
            accountManager.getAll_Hash(function(accounts){
                assert.strictEqual(accounts['a.c'].name, "Expenses");
            });
        });
        
        it('returns all accounts in an array of path', function() {
            let accountManager = new AccountManager(db_4yb);
            accountManager.accountType = ['INC', 'EXP'];
            accountManager.getAll_ArrayOfPath(function(accounts){
                assert.strictEqual(accounts.length, 10 + 40);
            });
        });
        
    });
});