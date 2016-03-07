/* global db_4yb */
const app = require('remote').require('app');
const jetpack = require('fs-jetpack').cwd(app.getAppPath());
var Vue = require('vue');
var currentBalance = 0;

exports.main = Vue.extend({
    name: 'comp-4yb-transactions'
    ,data: function () {
        return {
            title: 'Transactions',
            searchQuery: '',
            gridColumns: ['delete', 'code', 'description', 'posted_date', 'transaction_date', 'credit', 'debit', 'balance', 'save'],
            gridData: '',
            currentAccount: null
        }
    }
    ,template: jetpack.read('./components/transactions/main.vue.html')
    ,ready: function() {
        var vm = this;
        new Vue({
            el: '#transactions',
            components: {
                comp4ybTransactionsGrid: exports.grid
            },
            parent: vm
        });
    },
    created: function () {
        var vm = this;
        this.currentAccount = vm.$root.viewData;
        db_4yb.find({entity: 'transaction', transfer: this.currentAccount.path}).sort({ posted_date: 1 }).exec(function (err, docs) {
            vm.gridData = JSON.parse(JSON.stringify(docs));
        });
    }
});

exports.grid = Vue.component('comp-4yb-transactions-grid', {
    template: jetpack.read('./components/transactions/grid.vue.html'),
    props: {
        title: String,
        data: Array,
        columns: Array,
        filterKey: String
    },
    data: function () {
        return {
            accounts: null,
            transaction: {code: "", description: "", _group: "", transaction_date: new Date(), posted_date: new Date(), debit: null, credit: null, transfer: 3, note: ""},
            twinTransaction: {}
        }
    },
    computed: {
        totalDebit: function () {
            var total = 0;
            this.data.forEach(function(entry){
                var number = parseFloat(entry.debit);
                if (number > 0) {
                    total += number;
                }
            })
            return total;
        },
        totalCredit: function () {
            var total = 0;
            this.data.forEach(function(entry){
                var number = parseFloat(entry.credit);
                if (number > 0) {
                    total += number;
                }
            })
            return total;
        },
        action: function() {
            var action = "add";
            if (!!this.transaction._id) {
                action = "update";
            }
            return action;
        }
    },
    methods: {
        cancelTransaction: function() {
            this.transaction = {code: "", description: "", _group: "", transaction_date: new Date(), posted_date: new Date(), debit: null, credit: null, transfer: 3, note: ""};
            this.twinTransaction = {};
        },
        insertTransaction: function () {
            console.log(this.transaction);
            
            if (this.$parent.currentAccount !== null) {
            
                var vm = this;
                var transactionTransfer = JSON.parse(JSON.stringify(this.transaction.transfer));
                console.log(transactionTransfer);
                
                this.transaction.entity = "transaction";
                this.transaction._id = db_4yb.createNewId();
                this.transaction._group = this.transaction._id;
                this.transaction.transfer = this.$parent.currentAccount.path;
                
                var twinTransaction = JSON.parse(JSON.stringify(this.transaction));
                var twinId = db_4yb.createNewId();
                while (twinId == this.transaction._id) {
                    twinId = db_4yb.createNewId();
                }
                twinTransaction._id = twinId;
                twinTransaction.transfer = transactionTransfer.path;
                
                if (this.$parent.currentAccount.type === "BANK" || this.$parent.currentAccount.type === "ASSET") {
                    switch (transactionTransfer.type) {
                        case "CC":
                        case "LIA":
                            twinTransaction.debit = this.transaction.credit;
                            twinTransaction.credit = this.transaction.debit;
                        break;
                        default:
                        break;
                    }
                }
                
                if (this.$parent.currentAccount.type === "CC" || this.$parent.currentAccount.type === "LIA") {
                    switch (transactionTransfer.type) {
                        case "ASSET":
                        case "BANK":
                            twinTransaction.debit = this.transaction.credit;
                            twinTransaction.credit = this.transaction.debit;
                        break;
                        default:
                        break;
                    }
                }
                // */
                db_4yb.insert([this.transaction, twinTransaction], function (err, newDoc) {
                    vm.$root.currentView = "comp1";
                });
                // */
                
            }
            
        },
        saveTransaction: function() {
            if (this.$parent.currentAccount !== null) {
            
                var vm = this;
                var transactionTransfer = JSON.parse(JSON.stringify(this.transaction.transfer));
                
                console.log("Transfer account to: ");
                console.log(transactionTransfer);
                
                var currentTransaction = JSON.parse(JSON.stringify(this.transaction));
                currentTransaction.transfer = this.$parent.currentAccount.path;
                
                var twinTransaction = JSON.parse(JSON.stringify(this.twinTransaction));
                twinTransaction.transfer = transactionTransfer.path;
                twinTransaction.debit = currentTransaction.debit;
                twinTransaction.credit = currentTransaction.credit;
                
                if (this.$parent.currentAccount.type === "BANK" || this.$parent.currentAccount.type === "ASSET") {
                    switch (transactionTransfer.type) {
                        case "CC":
                            console.log("BANK | ASSET -> CC");
                        case "LIA":
                            console.log("BANK | ASSET -> LIA");
                            twinTransaction.debit = currentTransaction.credit;
                            twinTransaction.credit = currentTransaction.debit;
                        break;
                        default:
                        break;
                    }
                }
                
                if (this.$parent.currentAccount.type === "CC" || this.$parent.currentAccount.type === "LIA") {
                    switch (transactionTransfer.type) {
                        case "ASSET":
                            console.log("CC | LIA -> ASSET");
                        case "BANK":
                            console.log("CC | LIA -> BANK");
                            twinTransaction.debit = currentTransaction.credit;
                            twinTransaction.credit = currentTransaction.debit;
                        break;
                        default:
                        break;
                    }
                }
                
                console.log("Transaction:");
                console.log(currentTransaction);
                console.log("Twin Transaction:");
                console.log(twinTransaction);
                
                // /*
                db_4yb.update({_id: currentTransaction._id}, currentTransaction, function (err, numReplaced) {
                    console.log(err);
                    console.log(numReplaced);
                    db_4yb.update({_id: twinTransaction._id}, twinTransaction, function (err, numReplaced) {
                        console.log(err);
                        console.log(numReplaced);
                        vm.$root.currentView = "comp1";
                    });
                });
                // */
                
            }
        },
        editTransaction: function (transaction) {
            
            var vm = this;
            db_4yb.find({_group: transaction._group, transfer: { $ne: transaction.transfer }}).sort({ name: 1 }).exec(function (err, docs) {
                vm.transaction = transaction;
                vm.twinTransaction = docs[0];
                vm.accounts.forEach(function(entry){
                    if (entry.path === docs[0].transfer) {
                        vm.transaction.transfer = entry;
                    }
                });
                console.log(vm.transaction);
            });
            if (this.$parent.currentAccount !== null) {
            /*
                var vm = this;
                var transactionTransfer = JSON.parse(JSON.stringify(this.transaction.transfer));
                console.log(transactionTransfer);
                
                this.transaction.entity = "transaction";
                //this.transaction._id = db_4yb.createNewId();
                this.transaction._group = this.transaction._id;
                this.transaction.transfer = transactionTransfer.path;
                
                var twinTransaction = JSON.parse(JSON.stringify(this.transaction));
                var twinId = db_4yb.createNewId();
                while (twinId == this.transaction._id) {
                    twinId = db_4yb.createNewId();
                }
                twinTransaction._id = twinId;
                twinTransaction.transfer = this.$parent.currentAccount.path;
                
                // TODO : make it work for all kind of twin account (i.e. bank to credit card, debit becomes credit)
                // to do so, use the type account of this.$parent.currentAccount and transactionTransfer
                
                
                db_4yb.insert([this.transaction, twinTransaction], function (err, newDoc) {
                    vm.$root.currentView = "comp1";
                });
                // */
                
            }
            
        },
        deleteTransaction: function (transaction) {
            console.log(transaction);
            var vm = this;
            db_4yb.remove({ _group: transaction._group }, { multi: true }, function (err, numRemoved) {
                vm.$root.currentView = "comp1";
            });
            
        }
    }
    ,filters: {
        formatDate: function (date) {
            return date.split('T')[0];
        }
        ,camelCase: function (input) {
            return input.replace(/(?:^|\s|_)\w/g, function(match) {
                return match.toUpperCase().replace("_"," ");
            });
        }
        ,balance: function(input, currentIndex) {
            if (this.$parent.$parent.data[currentIndex - 1] === undefined) {
                console.log(input + "/" + currentIndex);
                currentBalance = input;
            } else {
                currentBalance += input;
            }
            return currentBalance;
        }
    }
    ,ready: function(){
        document.getElementById("transaction_code").focus();
    }
    ,activate: function (done){
        var vm = this;
        db_4yb.find({entity: 'account', path: { $ne: vm.$parent.currentAccount.path }}).sort({ name: 1 }).exec(function (err, docs) {
            vm.accounts = JSON.parse(JSON.stringify(docs));
        });
        done();
    }
});