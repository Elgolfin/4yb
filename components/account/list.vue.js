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
            accounts: {},
            treeData: {}
        }
    },
    computed: {
        hasChildren: function (){
            var hasChildren = this.treeData.children || {};
            return !!hasChildren.length;
        }
    },
    template: jetpack.read('./components/account/list.vue.html'),
    methods: {
        
    },
    created: function () {
        // /*
        var vm = this;
        db_4yb.find({entity: /account/ }).sort({ name: 1 }).exec(function (err, docs) { // WORKS
        //db_4yb.find({ entity: /account/ }, function (err, docs) { //  WORKS
        //db_4yb.find({ entity: { $regex: /ar/} }, function (err, docs) {
            if (!err) {
                vm.treeData = {
                    account: {name: "Accounts", path: "a"}, 
                    children: alphabet.buildTreeList("a", JSON.parse(JSON.stringify(docs)))
                }
            } else {
                console.log(err);
            }
        });
        // */
    },
    ready: function() {
        
    },
    mixins:[mixin]
});