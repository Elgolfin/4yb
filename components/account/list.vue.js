const app = require('remote').require('app');
const jetpack = require('fs-jetpack').cwd(app.getAppPath());
var Vue = require('vue');
var Datastore = require('nedb'), db = new Datastore({ filename: db_4yb_filepath, autoload: true });
var mixin = require('../../mixins/mixins.js').mixin;

exports.ListAccounts = Vue.extend({
    data: function () {
        return { 
            title: "Accounts",
            list: "list",
            accounts: null
        }
    },
    template: jetpack.read('./components/account/list.vue.html'),
    methods: {
        deleteAccount: function (account) {
            console.log("delete " + account._id);
            var vm = this;
            db.remove({ _id: account._id }, {}, function (err, numRemoved) {
                vm.accounts.$remove(account);
            });
        }
    },
    created: function () {
        var vm = this;
        db.find({entity: 'account'}).sort({ id: -1 }).exec(function (err, docs) {
            vm.accounts = docs;
        });
    },
    mixins:[mixin]
});