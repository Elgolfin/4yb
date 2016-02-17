/* global describe, it, before, after, expect */
var should = require('chai').should();
var assert = require('chai').assert;
var Account = require('../js/account.js').Account;

describe('Account', function() {
    
    before('Create the db test file', function () {
        console.log("before");
    });
    
    after('Delete the db test file', function () {
        console.log("after");
    });
    
    describe('Account Initialization', function() {
        
        it('returns an empty account', function() {
            var account = new Account();
            account._id.should.equal("");
        });
        
        it('save a new account', function(done) {
            var acc = {name: "new"};
            var account = new Account().load(acc);
            account.save(function() {
                account._id.should.not.equal("");
                assert.isUndefined(account.hidden);
                done();
            });
        });
        
        it('save an existing account', function(done) {
            var acc = {_id: '0aNHWb22sL0jX7zg', name: "updated", parent: "a"};
            var account = new Account().load(acc);
            account.save(function() {
                account._id.should.equal("0aNHWb22sL0jX7zg");
                account.name.should.equal("updated");
                done();
            });
        });
        
        it('load an account', function() {
            var acc = {name: "myName"};
            var account = new Account().load(acc);
            account.name.should.equal("myName");
        });
        
        it('get an existing account', function(done) {
            var account = new Account();
            account.get('0aNHWb22sL0jX7zg', function() {
                account._id.should.equal("0aNHWb22sL0jX7zg");
                done();
            });
            
        });
        
        it('try to get an unexisting account', function(done) {
            var account = new Account();
            account.get('1aNHWb22sL0jX7zg', function() {
                account._id.should.not.equal("0aNHWb22sL0jX7zg");
                account._id.should.equal("");
                done();
            });
            
        });
        
    });
});