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
        db_4yb.find({entity: 'transaction'}).sort({ posted_date: 1 }).exec(function (err, docs) {
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
            transaction: {code: "", description: "", transaction_date: new Date(), posted_date: new Date(), debit: null, credit: null, transfer: 3, note: ""}
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
            //console.log(this.transaction.posted_date);
            this.transaction.entity = "transaction";
            var vm = this;
            db_4yb.insert(this.transaction, function (err, newDoc) {
                /*vm.transaction = {code: "", description: "", transaction_date: new Date(), posted_date: new Date(), debit: null, credit: null, transfer: 3, note: ""};
                vm.data.push(JSON.parse(JSON.stringify(newDoc)));
                document.getElementById("transaction_code").focus();
                */
                vm.$root.currentView = "comp1";
            });
            
        },
        deleteTransaction: function (transaction) {
            console.log(transaction);
            var vm = this;
            db_4yb.remove({ _id: transaction._id }, {}, function (err, numRemoved) {
                /*console.log(err);
                console.log(numRemoved);
                vm.data.$remove(transaction);*/
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
});