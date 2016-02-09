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
            gridColumns: ['delete', 'code', 'description', 'posted_date', 'transaction_date', 'credit', 'debit', 'transfer', 'balance', 'save'],
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
        this.currentAccount = vm.$root.viewData
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
            transaction: {code: "", description: "", _group: "", transaction_date: new Date(), posted_date: new Date(), debit: null, credit: null, transfer: 3, note: ""}
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
        }
    },
    methods: {
        insertTransaction: function () {
            console.log(this.transaction);
            
            if (this.$parent.currentAccount !== null) {
            
                var vm = this;
                var transactionTransfer = JSON.parse(JSON.stringify(this.transaction.transfer));
                console.log(transactionTransfer);
                
                this.transaction.entity = "transaction";
                this.transaction._id = db_4yb.createNewId();
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
                    /*vm.transaction = {code: "", description: "", transaction_date: new Date(), posted_date: new Date(), debit: null, credit: null, transfer: 3, note: ""};
                    vm.data.push(JSON.parse(JSON.stringify(newDoc)));
                    document.getElementById("transaction_code").focus();
                    */
                    vm.$root.currentView = "comp1";
                });
                
            }
            
        },
        deleteTransaction: function (transaction) {
            console.log(transaction);
            var vm = this;
            db_4yb.remove({ _group: transaction._group }, { multi: true }, function (err, numRemoved) {
                console.log(err);
                console.log(numRemoved);
                /*vm.data.$remove(transaction);*/
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
        console.log(this.account);
        var vm = this;
        db_4yb.find({entity: 'account', path: { $ne: vm.$parent.currentAccount.path }}).sort({ name: 1 }).exec(function (err, docs) {
            vm.accounts = JSON.parse(JSON.stringify(docs));
        });
        done();
    }
});