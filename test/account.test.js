/* global describe, it, before, after, expect */ 
"use strict";
var assert = require('chai').assert;
var Account = require('../js/account.js').Account;
let Db4yb = require('../js/4yb-database.js').Db4yb;

let db_4yb;
let testData = [
    {
        _id: '0aNHWb22sL0jX7zg',
        name: 'original',
        code: 'code',
        type: 'type',
        path: 'a.a',
        parent: 'a',
        description: 'desc',
        hidden: false,
        placeholder: true,
        active: true,
        entity: "account"
    }
];
        
describe('Account', function() {
    
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
    
    describe('Account CRUD', function() {
        
        it('returns an empty account', function() {
            var account = new Account(db_4yb);
            assert.isNull(account._id);
        });
        
        it('save a first new account', function(done) {
            var acc = {name: "new 1", parent: 'a'};
            var account = new Account(db_4yb).load(acc);
            account.save(function() {
                assert.isString(account._id);
                assert.match(account._id, /[a-z0-9]{16}/i);
                assert.isUndefined(account.hidden);
                assert.strictEqual(account.path, "a.b");
                done();
            });
        });        
        
        it('save a second new account', function(done) {
            var acc = {name: "new 2", parent: 'a'};
            var account = new Account(db_4yb).load(acc);
            account.save(function() {
                assert.isString(account._id);
                assert.match(account._id, /[a-z0-9]{16}/i);
                assert.isUndefined(account.hidden);
                assert.strictEqual(account.path, "a.c");
                done();
            });
        });
        
        it('save an existing account (without changing the parent)', function(done) {
            var acc = {_id: '0aNHWb22sL0jX7zg', name: "updated", parent: "a"};
            var account = new Account(db_4yb).load(acc);
            account.save(function() {
                assert.strictEqual(account._id, "0aNHWb22sL0jX7zg");
                assert.strictEqual(account.name, "updated");
                assert.strictEqual(account.parent, "a");
                assert.strictEqual(account.path, "a.d");
                done();
            });
        });
        
        it('save an existing account (by also changing the parent)', function(done) {
            var acc = {_id: '0aNHWb22sL0jX7zg', name: "updated", parent: "a.b"};
            var account = new Account(db_4yb).load(acc);
            account.save(function() {
                assert.strictEqual(account._id, "0aNHWb22sL0jX7zg");
                assert.strictEqual(account.name, "updated");
                assert.strictEqual(account.parent, "a.b");
                assert.strictEqual(account.path, "a.b.a");
                done();
            });
        });
        
        it('load an account', function() {
            var acc = {name: "myName"};
            var account = new Account(db_4yb).load(acc);
                assert.strictEqual(account.name, "myName");
        });
        
        it('get an existing account', function(done) {
            var account = new Account(db_4yb);
            account.get('0aNHWb22sL0jX7zg', function() {
                assert.strictEqual(account._id, "0aNHWb22sL0jX7zg");
                done();
            });
            
        });
        
        it('try to get an unexisting account', function(done) {
            var account = new Account(db_4yb);
            account.get('unexisting', function() {
                assert.isNull(account._id);
                done();
            });
            
        });
        
    });
});