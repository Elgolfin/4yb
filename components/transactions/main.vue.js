const app = require('remote').require('app');
const jetpack = require('fs-jetpack').cwd(app.getAppPath());
var Vue = require('vue');

exports.main = Vue.extend({
    name: 'comp-4yb-transactions'
    ,data: function () {
        return {
            title: 'Transactions',
            searchQuery: '',
            gridColumns: ['_id', 'code', 'description', 'posted_date', 'transaction_date', 'credit', 'debit', 'transfer_from', 'note'],
            gridData: ''
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
        db_4yb.find({entity: 'transaction'}).sort({ transaction_date: -1 }).exec(function (err, docs) {
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
        var sortOrders = {}
        this.columns.forEach(function (key) {
            sortOrders[key] = 1
        })
        return {
            sortKey: '',
            sortOrders: sortOrders,
            transaction: {code: "", description: "", transaction_date: new Date(), posted_date: new Date(), debit: null, credit: null, transfert_Account: 3, note: ""}
        }
    },
    computed: {
        totalDebit: function () {
            var total = 0;
            this.data.forEach(function(entry){
                if (entry.debit > 0) {
                    total += entry.debit;
                }
            })
            return total;
        },
        totalCredit: function () {
            var total = 0;
            this.data.forEach(function(entry){
               if (entry.credit > 0) {
                    total += entry.credit;
               }
            })
            return total;
        }
    },
    methods: {
        sortBy: function (key) {
            this.sortKey = key
            this.sortOrders[key] = this.sortOrders[key] * -1
        },
        insertTransaction: function () {
            console.log(this.transaction);
            //console.log(this.transaction.posted_date);
            this.transaction.entity = "transaction";
            var vm = this;
            db_4yb.insert(this.transaction, function (err, newDoc) {
                console.log(vm.data);
                console.log(err);
                console.log(newDoc);
                vm.transaction = {code: "", description: "", transaction_date: new Date(), posted_date: new Date(), debit: null, credit: null, transfert_Account: 3, note: ""};
                vm.data.push(JSON.parse(JSON.stringify(newDoc)));
            });
            
        },
        deleteTransaction: function (transaction) {
            //console.log(this.transaction.posted_date);
            console.log(transaction);
            var vm = this;
            db_4yb.remove({ _id: transaction._id }, {}, function (err, numRemoved) {
                console.log(err);
                console.log(numRemoved);
                vm.data.$remove(transaction);
            });
            
        }
            
 
    }
    ,filters: {
        formatDate: function (date) {
            //return date.toISOString().split('T')[0];
        }
        ,camelCase: function (input) {
            return input.replace(/(?:^|\s|_)\w/g, function(match) {
                return match.toUpperCase().replace("_"," ");
            });
        }
    }
});