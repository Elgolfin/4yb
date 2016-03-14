/* global db_4yb */
"use strict";
const AccountManager = require('./account-manager.js').AccountManager;

let TransactionsManager = exports.TransactionsManager = function (db) {
    this.db = db;
    this.excludedAccount = null; // A path (string) or an array of path (array of strings)
    this.rootAccount = "a"; // A path (string)
    this.inheritance = false;
    this.transactions = [];
    this.accounts = null;
    return this;
}

TransactionsManager.prototype.getAll = function () {
    let callback = function () { };
    let numArgs = arguments.length;
    if (numArgs == 1) {
        callback = arguments[0];
    }
    
    let rootAccount = this.rootAccount;
    let exactSearch = "$";
    if (this.inheritance) {
        exactSearch = "";
    }
    let regex = new RegExp("^" + rootAccount + "\\.?" + exactSearch);
    let query = { entity: "transaction", transfer: regex };
    if (typeof this.excludedAccount === 'string') {
        query = { entity: "transaction"
                , $and: [{transfer: regex}, {transfer: { $ne: this.excludedAccount }}] 
                };
    }
    
    if (Array.isArray(this.excludedAccount)) {
        query = { entity: "transaction"
                , $and: [{transfer: regex}, {transfer: { $nin: this.excludedAccount }}] 
                };
    }
    
    let ref = this;
    this.db.findAsync(query).sort({ posted_date: 1 }).execAsync().then(function (docs) {
        let transactions = JSON.parse(JSON.stringify(docs));
        let accountManager = new AccountManager(ref.db);
        accountManager.getAll_Hash(function(accounts){
            ref.accounts = accounts;
            transactions = setBalance(transactions);
            transactions = setTransfer.call(ref, transactions);
            ref.transactions = transactions;
            callback(ref);
        });  
    });
}

// TODO: calculate the data for both inc and exp
TransactionsManager.prototype.getChartsDataSet = function () {
    let labels = [];
    let datasets_EXP = [];
    let datasets_INC = [];
    
    // Initialize arrays
    let currentLabelIndex = 0;
    let yearMonth = this.transactions[0].posted_date.getFullYear().toString()  + "-" +  this.transactions[0].posted_date.getMonth().toString();
    labels[currentLabelIndex] = yearMonth;
    datasets_EXP[currentLabelIndex] = 0;
    datasets_INC[currentLabelIndex] = 0;
    
    // Do the calculation
    this.transactions.forEach(function(entry){
        let currentYearMonth = entry.posted_date.getFullYear().toString() + "-" + entry.posted_date.getMonth().toString();
        if (currentYearMonth === labels[currentLabelIndex]) {
            if (entry.transfer.type === 'EXP') {
                datasets_EXP[currentLabelIndex] += (entry.credit || 0) - (entry.debit || 0);
            }
            if (entry.transfer.type === 'INC') {
                //console.log(currentYearMonth + ": " + entry.credit + "/" + entry.debit + "(" + entry.transfer.path + ")");
                datasets_INC[currentLabelIndex] += (entry.credit || 0) - (entry.debit || 0);
            }
        } else {
            datasets_EXP[currentLabelIndex] = Math.abs(datasets_EXP[currentLabelIndex]);
            datasets_INC[currentLabelIndex] = Math.abs(datasets_INC[currentLabelIndex]);
            currentLabelIndex++;
            datasets_EXP[currentLabelIndex] = 0;
            datasets_INC[currentLabelIndex] = 0;
            labels[currentLabelIndex] = currentYearMonth;
            if (entry.transfer.type === 'EXP') {
                datasets_EXP[currentLabelIndex] = (entry.credit || 0) - (entry.debit || 0);
            }
            if (entry.transfer.type === 'INC') {
                //console.log(currentYearMonth + ": " + entry.credit + "/" + entry.debit + "(" + entry.transfer.path + ")");
                datasets_INC[currentLabelIndex] = (entry.credit || 0) - (entry.debit || 0);
            }
        }
    });
    
    // Last Iteration Clean-Up
    datasets_EXP[currentLabelIndex] = Math.abs(datasets_EXP[currentLabelIndex]);
    datasets_INC[currentLabelIndex] = Math.abs(datasets_INC[currentLabelIndex]);
    
    // Keep only the absolute values within each dataset
     /*
    datasets.forEach(function(entry){
        entry = Math.abs(entry);
    });
    // */
    
    return {
        labels: labels,
        datasets: [
            {
                label: "My incomes",
                fillColor: "rgba(151,187,205,0.5)",
                strokeColor: "rgba(151,187,205,0.8)",
                highlightFill: "rgba(151,187,205,0.75)",
                highlightStroke: "rgba(151,187,205,1)",
                data: datasets_INC
            },
            {
                label: "My expenses",
                fillColor: "rgba(220,220,220,0.5)",
                strokeColor: "rgba(220,220,220,0.8)",
                highlightFill: "rgba(220,220,220,0.75)",
                highlightStroke: "rgba(220,220,220,1)",
                data: datasets_EXP
            }        
        ]
    }
}

function setBalance(transactions){
    transactions.forEach(function(entry, index){
        entry.posted_date = new Date(entry.posted_date);
        entry.transaction_date = new Date(entry.transaction_date);
        entry.recognition_date = new Date(entry.recognition_date);
        if (index === 0) {
            entry.balance = entry.credit - entry.debit;
        } else {
            entry.balance = transactions[index - 1].balance + entry.credit - entry.debit;
        }
    });
    return transactions;
}

function setTransfer(transactions){
    let ref = this;
    transactions.forEach(function(entry){
        entry.transfer = ref.accounts[entry.transfer];
    });
    return transactions;
}


/*

labels: ["January", "February", "March", "April", "May", "June", "July"],
                datasets: [
                    {
                        label: "My First dataset",
                        fillColor: "rgba(220,220,220,0.5)",
                        strokeColor: "rgba(220,220,220,0.8)",
                        highlightFill: "rgba(220,220,220,0.75)",
                        highlightStroke: "rgba(220,220,220,1)",
                        data: [65, 59, 80, 81, 56, 55, 40]
                    },
                    {
                        label: "My Second dataset",
                        fillColor: "rgba(151,187,205,0.5)",
                        strokeColor: "rgba(151,187,205,0.8)",
                        highlightFill: "rgba(151,187,205,0.75)",
                        highlightStroke: "rgba(151,187,205,1)",
                        data: [28, 48, 40, 19, 86, 27, 90]
                    }
                ]

*/