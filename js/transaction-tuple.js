/* global db_4yb */
"use strict";

let TransactionTuple = exports.TransactionTuple = function (db) {
    this.db = db;
    
    // Common properties to both transactions
    this.code = null;
    this.description = null;
    this.note = null;
    this._group = null;
    this.transactionDate = null;
    this.postedDate = null;
    this.recognitionDate = null;
    this.city = null;
    this.state = null;
    this.country = null;
    this.zipcode = null;
    
    // Transaction specific (current)
    this.currentTransaction = {
        code: this.code,
        description: this.description,
        note: this.note,
        _group: this._group,
        transactionDate: this.transactionDate,
        postedDate: this.postedDate,
        recognitionDate: this.recognitionDate,
        city: this.city,
        state: this.state,
        country: this.country,
        zipcode: this.zipcode,
        transfer: null,
        _id: null,
        debit: null,
        credit: null
    };
    
    // Transaction specific (twin)
    this.twinTransaction = {
        code: this.code,
        description: this.description,
        note: this.note,
        _group: this._group,
        transactionDate: this.transactionDate,
        postedDate: this.postedDate,
        recognitionDate: this.recognitionDate,
        city: this.city,
        state: this.state,
        country: this.country,
        zipcode: this.zipcode,
        transfer: null,
        _id: null,
        debit: null,
        credit: null
    };
    
    return this;
}

TransactionTuple.prototype.save = function () {
    let callback = function () { };
    let numArgs = arguments.length;
    if (numArgs == 1) {
        callback = arguments[0];
    }
    
    if (!this._id) {
        this.currentTransaction._id = this.db.createNewId();
        this.twinTransaction._id = this.db.createNewId();
        while (this.twinTransaction._id == this.currentTransaction._id) {
            this.twinTransaction._id = db_4yb.createNewId();
        }
        this._group = this._id;
    }
    
    this.twinTransaction.debit = this.currentTransaction.debit;
    this.twinTransaction.credit = this.currentTransaction.credit;
    
    // Managing the account transfer by reversing credit with debit (or vice versa) depending of the involved accounts type
    if (this.currentTransaction.transfer.type === "BANK" 
        || this.currentTransaction.transfer.type === "ASSET" 
        || this.currentTransaction.transfer.type === "LIA" 
        || this.currentTransaction.transfer.type === "CC") {
        switch (this.twinTransaction.transfer.type) {
            case "ASSET":
            case "BANK":
            case "CC":
            case "LIA":
                this.twinTransaction.debit = this.currentTransaction.credit;
                this.twinTransaction.credit = this.currentTransaction.debit;
            break;
            default:
            break;
        }
    }
    
    saveTransactionTuple.call(this, callback);
}

TransactionTuple.prototype.delete = function () {

}

TransactionTuple.prototype.add = function (callback) {
    TransactionTuple.prototype.save(callback);
}

// linkedTransfer
TransactionTuple.prototype.load = function (currentTransaction, twinTransaction) {
    this.code = currentTransaction.code;
    this.description = currentTransaction.description;
    this.note = currentTransaction.note;
    this._group = currentTransaction._group;
    this.transactionDate = currentTransaction.transactionDate;
    this.postedDate = currentTransaction.postedDate;
    this.recognitionDate = currentTransaction.recognitionDate;
    this.city = currentTransaction.city;
    this.state = currentTransaction.state;
    this.country = currentTransaction.country;
    this.zipcode = currentTransaction.zipcode;
    
    this.currentTransaction.transfer = currentTransaction.transfer;
    this.currentTransaction._id = currentTransaction._id;
    this.currentTransaction.debit = currentTransaction.debit;
    this.currentTransaction.credit = currentTransaction.credit;
    this.twinTransaction.transfer = twinTransaction.transfer;
    this.twinTransaction._id = twinTransaction._id;
    this.twinTransaction.debit = twinTransaction.debit;
    this.twinTransaction.credit = twinTransaction.credit;
    
    setCommonProperties.call(this);
    return this;
}

TransactionTuple.prototype.get = function (group, currentTransfer, callback) {
    let account = this;
    this.db.findAsync({ _group: group }).execAsync().then(function (docs) {
        if (docs !== null) {
            if (docs[0].transfer === currentTransfer.path) {
                account.load(docs[0], docs[1]);
            } else {
                account.load(docs[1], docs[0]);
            }
        }
        callback();
    });
}

TransactionTuple.prototype.JSONify = function () {
    return {
        currentTransaction: {
            code: this.code,
            description: this.description,
            note: this.note,
            _group: this._group,
            transactionDate: this.transactionDate,
            postedDate: this.postedDate,
            recognitionDate: this.recognitionDate,
            city: this.city,
            state: this.state,
            country: this.country,
            zipcode: this.zipcode,
            transfer: this.currentTransaction.transfer.path,
            _id: this.currentTransaction._id,
            debit: this.currentTransaction.debit,
            credit: this.currentTransaction.credit,
            entity: "transaction"
        },
        twinTransaction: {
            code: this.code,
            description: this.description,
            note: this.note,
            _group: this._group,
            transactionDate: this.transactionDate,
            postedDate: this.postedDate,
            recognitionDate: this.recognitionDate,
            city: this.city,
            state: this.state,
            country: this.country,
            zipcode: this.zipcode,
            transfer: this.twinTransaction.transfer.path,
            _id: this.twinTransaction._id,
            debit: this.twinTransaction.debit,
            credit: this.twinTransaction.credit,
            entity: "transaction"
        }
    };
}

function saveTransactionTuple(callback) {
    const transactionTupleToBeSaved = this.JSONify();
    const db = this.db;
    db.update({ _id: transactionTupleToBeSaved.currentTransaction._id }, transactionTupleToBeSaved.currentTransaction, { upsert: true }, function (err, numReplaced) {
        if (err) { throw err; }
        db.update({ _id: transactionTupleToBeSaved.twinTransaction._id }, transactionTupleToBeSaved.twinTransaction, { upsert: true }, function (err, numReplaced) {
            if (err) { throw err; }
            callback(transactionTupleToBeSaved);
        });
    });
}

function setCommonProperties() {
    
    let transactions = [this.currentTransaction, this.twinTransaction];
    let transactionTuple = this;
    transactions.forEach(function(entry) {
        entry.code = transactionTuple.code;
        entry.description = transactionTuple.description;
        entry.note = transactionTuple.note;
        entry._group = transactionTuple._group;
        entry.transactionDate = transactionTuple.transactionDate;
        entry.postedDate = transactionTuple.postedDate;
        entry.recognitionDate = transactionTuple.recognitionDate;
        entry.city = transactionTuple.city;
        entry.state = transactionTuple.state;
        entry.country = transactionTuple.country;
        entry.zipcode = transactionTuple.zipcode;
    });

    return this;
}