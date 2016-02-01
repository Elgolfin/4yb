const app = require('remote').require('app');
const jetpack = require('fs-jetpack').cwd(app.getAppPath());
var Vue = require('vue');

exports.comp1 = Vue.extend({
    data: function () {
        return { title: "comp1 title", comp1: "comp1" }
    },
    template: jetpack.read('./components/comp1.vue.html')
});