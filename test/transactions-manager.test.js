/* global describe, it, before, after, expect */ 
"use strict";
const assert = require('chai').assert;
const TransactionsManager = require('../js/transactions-manager.js').TransactionsManager;
const Db4yb = require('../js/4yb-database.js').Db4yb;
const jetpack = require('fs-jetpack').cwd('./test/');

let db_4yb;
let testData = jetpack.read('./transactions-manager.test.data.json', 'jsonWithDates');
        
describe('Transactions Manager', function() {
    
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
    
    describe('Transactions Get', function() {
        
        it('returns all transactions from specific account with path a.a (no inheritance)', function() {
            var transactionsManager = new TransactionsManager(db_4yb);
            transactionsManager.rootAccount = "a.a";
            transactionsManager.getAll(function(tm){
                let transactions = tm.transactions;
                assert.strictEqual(transactions.length, 3);
                assert.isAbove(transactions[1].posted_date, transactions[0].posted_date);
                assert.strictEqual(Object.prototype.toString.call(transactions[0].posted_date), "[object Date]");
                assert.strictEqual(Object.prototype.toString.call(transactions[0].transaction_date), "[object Date]");
                assert.strictEqual(Object.prototype.toString.call(transactions[0].recognition_date), "[object Date]");
                assert.strictEqual(transactions[1].balance, -120.01);
                assert.strictEqual(transactions[2].balance, -174.02);
                assert.strictEqual(transactions[1].transfer.path, "a.a");
                assert.strictEqual(transactions[2].transfer.path, "a.a");
            });
        });
        
        it('returns the graph dataset from specific account with path a.a (no inheritance, only INC and EXP accounts will be used for the calculation)', function() {
            var transactionsManager = new TransactionsManager(db_4yb);
            transactionsManager.rootAccount = "a.a";
            transactionsManager.getAll(function(tm){
                let dataChart = tm.getChartsDataSet();
                assert.strictEqual(dataChart.labels.length, 1);
                assert.strictEqual(dataChart.datasets[0].data.length, 1);
                assert.strictEqual(dataChart.datasets[0].data[0], 0); // a.a is a bank
                assert.strictEqual(dataChart.datasets[1].data.length, 1);
                assert.strictEqual(dataChart.datasets[1].data[0], 0);
            });
        });
        
        // TODO add a test when date is the first of a month (because of the time zone it will be counted as the month before)
        it('returns the graph dataset (only INC and EXP accounts will be used for the calculation)', function() {
            var transactionsManager = new TransactionsManager(db_4yb);
            transactionsManager.inheritance = true;
            transactionsManager.getAll(function(tm){
                let dataChart = tm.getChartsDataSet();
                assert.strictEqual(dataChart.labels.length, 1);
                assert.strictEqual(dataChart.datasets[1].data.length, 1);
                assert.strictEqual(dataChart.datasets[1].data[0], 174.02);
                assert.strictEqual(dataChart.datasets[0].data.length, 1);
                assert.strictEqual(dataChart.datasets[0].data[0], 0);
            });
        });
        
    });
});