const app = require('remote').require('app');
const jetpack = require('fs-jetpack').cwd(app.getAppPath());
var Vue = require('vue');
var mixin = require('../../mixins/mixins.js').mixin;

exports.ListAccounts = Vue.component('comp-4yb-list-accounts', {
    data: function () {
        return { 
            title: "Accounts",
            accounts: null
        }
    },
    template: jetpack.read('./components/account/list.vue.html'),
    methods: {
        deleteAccount: function (account) {
            console.log("delete account: " + account._id);
            var vm = this;
            db_4yb.remove({ _id: account._id }, {}, function (err, numRemoved) {
                vm.accounts.$remove(account);
            });
        },
        viewAccount: function (account) {
            console.log("view account: " + account._id);
            console.log(account);
            var vm = this;
            this.$root.currentView = "comp4ybFormAccount";
            this.$root.viewData = account;
        }
    },
    created: function () {
        var vm = this;
        db_4yb.find({entity: 'account'}).sort({ name: 1 }).exec(function (err, docs) {
            vm.accounts = JSON.parse(JSON.stringify(docs));
        });
    },
    mixins:[mixin]
});