const app = require('remote').require('app');
const jetpack = require('fs-jetpack').cwd(app.getAppPath());
var Vue = require('vue');

exports.comp3 = Vue.extend({
    data: function () {
        return { title: "comp3 title", comp3: "comp3" }
    },
    template: jetpack.read('./components/comp3.vue.html')
});