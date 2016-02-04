const app = require('remote').require('app');
const jetpack = require('fs-jetpack').cwd(app.getAppPath());
var Vue = require('vue');

//exports.formAccount = new Vue({
exports.formAccount = Vue.component('comp-4yb-form-account', {
    data: function () {
        return { 
            title: "Add an Account",
            account: {name: "", code: "", type:"", parent:"", description: "", hidden:"", placeholder:"", active:""}
         }
    },
    template: jetpack.read('./components/account/form.vue.html'),
    methods: {
        updateAccount: function () {
            var account = this.account;
            this.account.entity = "account";
            var vm = this;
            
            db_4yb.update({ _id: account._id }, account, {upsert: true}, function (err, numReplaced) {
                console.log("updateAccount Error: " + err);
                console.log("Number of replaced documents: " + numReplaced);
                vm.account = {name: "", code: "", type:"", parent:"", description: "", hidden:"", placeholder:"", active:""} 
                vm.$root.currentView = "comp4ybListAccounts";               
            });
            
            /*
            db_4yb.insert(account, function (err, newDoc) {
                console.log("updateAccount Error: " + err);
                console.log("Inserted Document is: ");
                console.log(newDoc);
                vm.account = {name: "", code: "", type:"", parent:"", description: "", hidden:"", placeholder:"", active:""} 
                var vmAccount = Vue.component('comp-4yb-form-account');
                vm.$root.currentView = "comp4ybListAccounts"; 
            });*/
            
        },
    },
    props: {
        myData: String  
    },
    activate: function (done) {
        var self = this;
        this.account = this.$root.viewData;
        done();
    },
    events: {
        'test': function (account) {
            console.log("event test: " + account.name);
        }
    }
});