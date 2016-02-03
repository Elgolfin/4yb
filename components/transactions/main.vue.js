const app = require('remote').require('app');
const jetpack = require('fs-jetpack').cwd(app.getAppPath());
var Vue = require('vue');

exports.main = Vue.extend({
    name: 'comp-4yb-transactions'
    ,data: function () {
        return {
            title: 'Transactions',
            searchQuery: '',
            gridColumns: ['code', 'posted_date'],
            gridData: [
                { code: 'Chuck Norris', posted_date: new Date('1995-12-17') },
                { code: 'Jackie Chan', posted_date: new Date('1996-12-17') },
                { code: 'Bruce Lee', posted_date: new Date('1996-12-19') },
                { code: 'Jet Li', posted_date: new Date('1996-10-17') }
            ]
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
    methods: {
        sortBy: function (key) {
            this.sortKey = key
            this.sortOrders[key] = this.sortOrders[key] * -1
        }
 
    }
    ,filters: {
        formatDate: function (date) {
            return date.toISOString().split('T')[0];
        }
        ,camelCase: function (input) {
            return input.replace(/(?:^|\s|_)\w/g, function(match) {
                return match.toUpperCase().replace("_"," ");
            });
        }
    }
});