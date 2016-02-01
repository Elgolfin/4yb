const app = require('remote').require('app');
const jetpack = require('fs-jetpack').cwd(app.getAppPath());
var Vue = require('vue');
var Datastore = require('nedb'), db = new Datastore({ filename: db_4yb_filename, autoload: true });

exports.ListAccounts = Vue.extend({
    data: function () {
        return { 
            title: "list accounts",
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
        db.find({}).sort({ id: -1 }).exec(function (err, docs) {
            vm.accounts = docs;
        });
    }
});