/* global db_4yb */
const app = require('remote').require('app');
const jetpack = require('fs-jetpack').cwd(app.getAppPath());
var Vue = require('vue');
var mixin = require('../../mixins/mixins.js').mixin;
const alphabet = require('../../js/alphabet.js').alphabet;

exports.ListAccounts = Vue.component('comp-4yb-list-accounts', {
    data: function () {
        return { 
            title: "Accounts",
            accounts: null,
            treeData: null
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
        db_4yb.find({entity: /account/ }).sort({ name: 1 }).exec(function (err, docs) { // WORKS
        //db_4yb.find({ entity: /account/ }, function (err, docs) { //  WORKS
        //db_4yb.find({ entity: { $regex: /ar/} }, function (err, docs) {
            if (!err) {
                vm.treeData = {
                    account: {name: "Accounts", path: "a"}, 
                    children: alphabet.buildTree("a", JSON.parse(JSON.stringify(docs)))
                }
            } else {
                console.log(err);
            }
        });
    },
    ready: function() {
        var vm = this;
        new Vue({
            el: '#accounts',
            components: {
                item: exports.item
            },
            parent: vm,
        });
    },
    mixins:[mixin]
});


exports.item = Vue.component('item', {
    template: jetpack.read('./components/account/account-treeitem.vue.html'),
    props: {
        model: Object,
        open: Boolean,
        root: Boolean,
        level: Number
    },
    data: function () {
        return {}
    },
    computed: {
        isFolder: function () {
            return (this.model.children && this.model.children.length);
        }
    },
    methods: {
        toggle: function () {
            if (this.isFolder) {
                this.open = !this.open;
            }
        },
        deleteAccount: function (account) {
            console.log("delete account: " + account._id);
            var vm = this;
            db_4yb.remove({ _id: account._id }, {}, function (err, numRemoved) {
                vm.$remove(vm.model);
            });
        },
        viewAccount: function (account) {
            console.log("view account: " + account._id);
            var vm = this;
            this.$root.currentView = "comp4ybFormAccount";
            this.$root.viewData = {action: 'view', account: account};
        },
        addAccount: function (account) {
            console.log("add account with parent: " + account._id);
            var vm = this;
            this.$root.currentView = "comp4ybFormAccount";
            this.$root.viewData = {action: 'add', account: account};
        }
    }
})