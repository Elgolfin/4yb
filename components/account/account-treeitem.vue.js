/* global db_4yb */
"use strict";
const app = require('remote').require('app');
const jetpack = require('fs-jetpack').cwd(app.getAppPath());
var Vue = require('vue');
var mixin = require('../../mixins/mixins.js').mixin;
const alphabet = require('../../js/alphabet.js').alphabet;


exports.accountTreeItem = Vue.extend({
    template: jetpack.read('./components/account/account-treeitem.vue.html'),
    props: {
        model: Object,
        open: Boolean,
        root: Boolean,
        level: Number,
        type: {
            type: String,
            default: 'menu',
            validator: function (value) {
                return (value.toLowerCase() === 'menu' || value.toLowerCase() === 'select');
            }
        }
    },
    data: function () {
        return {}
    },
    computed: {
        hasChildren: function () {
            return (this.model.children && this.model.children.length);
        },
        isSelect: function () {
            return this.type === 'select';
        }
    },
    methods: {
        toggle: function () {
            if (this.hasChildren) {
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
            let vm = this;
            this.$root.currentView = "comp4ybFormAccount";
            this.$root.viewData = {action: 'view', account: account};
        },
        addAccount: function (account) {
            console.log("add account with parent: " + account._id);
            let vm = this;
            this.$root.currentView = "comp4ybFormAccount";
            this.$root.viewData = {action: 'add', account: account};
        },
        openTransactions: function (account) {
            console.log("open account transactions: " + account._id);
            console.log(account);
            let vm = this;
            this.$root.currentView = "comp4ybTransactions";
            this.$root.viewData = account;
        }
    },
    activate: function(done){
        //console.log(this.model);
        done();
    }
});