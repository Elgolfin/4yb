/* global db_4yb */
const app = require('remote').require('app');
const jetpack = require('fs-jetpack').cwd(app.getAppPath());
const alphabet = require('../../js/alphabet.js').alphabet;
const Account = require('../../js/account.js').Account;
var Vue = require('vue');

//exports.formAccount = new Vue({
exports.formAccount = Vue.component('comp-4yb-form-account', {
    data: function () {
        return { 
            title: "Add an Account",
            account: {name: "", code: "", type:"", path:"", parent: "", description: "", hidden:"", placeholder:"", active:""},
            currentPath: null,
            accounts: null
         }
    },
    computed: {
        path: function() {
            return alphabet.getNextEntry(this.account.path);
        }
    },
    template: jetpack.read('./components/account/form.vue.html'),
    methods: {
        updateAccount: function () {
            var account = this.account;
            this.account.entity = "account";
            var vm = this;
            
            console.log("Old Parent Path: " + alphabet.getParentPath(vm.currentPath));
            console.log("New Parent Path: " + vm.account.parent);
            db_4yb.find({parent: vm.account.parent}).sort({ path: -1 }).exec(function (err, docs) {
                console.log(docs);
                if (alphabet.getParentPath(vm.currentPath) != vm.account.parent) {
                    if (docs.length > 0) {
                        console.log("Last Entry of the parent: " + docs[0].path);
                        vm.account.path = alphabet.getNextEntry(docs[0].path);
                    } else {
                        vm.account.path = vm.account.parent + ".a";
                    }
                    console.log("Path of the account: " + vm.account.path);
                }
            
                db_4yb.update({ _id: vm.account._id }, vm.account, {upsert: true}, function (err, numReplaced) {
                    vm.account = {name: "", code: "", type:"", path:"", parent:"", description: "", hidden:"", placeholder:"", active:""} 
                    vm.$root.currentView = "comp4ybListAccounts";               
                });
                
            });
            
        },
    },
    props: {
        myData: String  
    },
    activate: function (done) {
        if (this.$root.viewData.account !== undefined) {
            this.account._id ? this.title = "Edit Account" : this.title = "Add Account";
            if (this.$root.viewData.action == 'view') {
                console.log('View');
                this.account = this.$root.viewData.account;
                this.currentPath = this.account.path;
            } else {
                console.log('Add');
                this.account = {name: "", code: "", type:"", path:"", parent: "", description: "", hidden:"", placeholder:"", active:""};
                this.account.parent = this.$root.viewData.account.path;
            }
            console.log(this.account);
            var vm = this;
            db_4yb.find({entity: 'account', path: { $ne: this.currentPath }}).sort({ name: 1 }).exec(function (err, docs) {
                vm.accounts = JSON.parse(JSON.stringify(docs));
            });
        }
        done();
    },
    created: function (done) {
        
    },
    events: {
        'test': function (account) {
            console.log("event test: " + account.name);
        }
    }
});