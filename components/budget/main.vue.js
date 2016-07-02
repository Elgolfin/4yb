const app = require('electron').remote.app;
const jetpack = require('fs-jetpack').cwd(app.getAppPath());
var Vue = require('vue');

exports.budget = Vue.extend({
    data: function () {
        return { title: "Budget" }
    },
    template: jetpack.read('./components/budget/main.vue.html')
});