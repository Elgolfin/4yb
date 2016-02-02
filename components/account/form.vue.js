const app = require('remote').require('app');
const jetpack = require('fs-jetpack').cwd(app.getAppPath());
var Vue = require('vue');

exports.formAccount = Vue.extend({
    data: function () {
        return { title: "Add an Account" }
    },
    template: jetpack.read('./components/account/form.vue.html')
});