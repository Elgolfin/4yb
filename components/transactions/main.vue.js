const app = require('remote').require('app');
const jetpack = require('fs-jetpack').cwd(app.getAppPath());
var Vue = require('vue');
var Datastore = require('nedb'), db = new Datastore({ filename: db_4yb_filepath, autoload: true });

exports.main = Vue.extend({
    name: 'comp-4yb-transactions'
    ,data: function () {
        return {
            title: 'Transactions',
            searchQuery: '',
            gridColumns: ['code', 'description', 'posted_date', 'transaction_date', 'credit', 'debit', 'transfer_from', 'note'],
            gridData: ''/*[
                { 
                    entity: 'transaction',
                    code: 'Chuck Norris',
                    description: 'desc', 
                    posted_date: new Date('1995-12-17'), 
                    transaction_date: new Date('1995-12-18'),
                    debit: 123.45,
                    credit: null,
                    transfer_to: 1,
                    transfer_from: 2,
                    note: '',
                    group_id: null 
                },
                { 
                    entity: 'transaction',
                    code: 'Jackie Chan', 
                    posted_date: new Date('1996-12-17'), 
                    transaction_date: new Date('1997-01-01'),
                    debit: null,
                    credit: 2134.67,
                    transfer_to: 1,
                    transfer_from: 2,
                    note: '',
                    group_id: null 
                },
                { 
                    entity: 'transaction',
                    code: 'Bruce Lee', 
                    posted_date: new Date('1996-12-19'), 
                    transaction_date: new Date('1996-12-22'),
                    debit: 3.45,
                    credit: null,
                    transfer_to: 1,
                    transfer_from: 2,
                    note: '',
                    group_id: null  
                },
                { 
                    entity: 'transaction',
                    code: 'Jet Li', 
                    posted_date: new Date('1996-10-17'), 
                    transaction_date: new Date('1996-10-18'),
                    debit: 123,
                    credit: null,
                    transfer_to: 1,
                    transfer_from: 2,
                    note: '',
                    group_id: null  
                }
            ]*/
        }
    }
    ,template: jetpack.read('./components/transactions/main.vue.html')
    ,ready: function() {
        var transactionsVM = new Vue({
            el: '#transactions',
            components: {
                comp4ybTransactionsGrid: exports.grid
            }
        });
    },
    created: function () {
        var vm = this;
        db.find({entity: 'transaction'}).sort({ transaction_date: -1 }).exec(function (err, docs) {
            vm.gridData = docs;
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
            sortOrders: sortOrders
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