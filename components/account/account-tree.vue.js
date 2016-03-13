/* global db_4yb */
'use strict';
const app = require('remote').require('app');
const jetpack = require('fs-jetpack').cwd(app.getAppPath());
const AccountManager = require('../../js/account-manager.js').AccountManager;
let Vue = require('vue');

exports.accountTree = Vue.extend({
    data: function () {
        return { 
            selected: null,
            accounts: null
         }
    },
    computed: {
        isSelect: function () {
            return this.type === 'select';
        }
    },
    template: jetpack.read('./components/account/account-tree.vue.html'),
    methods: {
        
    },
    props: {
        name: String,
        id: String,
        exclude: String,
        default: String,
        type: {
            type: String,
            default: 'select',
            validator: function (value) {
                return (value.toLowerCase() === 'menu' || value.toLowerCase() === 'select');
            }
        }
          
    },
    activate: function (done) {
       done();
    },
    created: function (done) {
        let vm = this;
        var accountManager = new AccountManager(db_4yb);
        if (this.isSelect) {
            // TODO: exclude current account
            accountManager.getAll_FlatList(function(accounts){
                vm.accounts = accounts;
            });
        } else {
            accountManager.getAll_TreeList(function(accounts){
                vm.accounts = accounts;
            });
        }
    },
    events: {
        
    }
});