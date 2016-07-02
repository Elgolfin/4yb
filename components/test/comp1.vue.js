const app = require('electron').remote.app;
const jetpack = require('fs-jetpack').cwd(app.getAppPath());
var Vue = require('vue');

exports.comp1 = Vue.extend({
    created: function(){
        this.$root.currentView = "comp4ybTransactions";
    }
});