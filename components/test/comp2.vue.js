const app = require('electron').remote.app;
const jetpack = require('fs-jetpack').cwd(app.getAppPath());
var Vue = require('vue');

exports.comp2 = Vue.extend({
    data: function () {
        return { title: "comp2 title", comp2: "comp2" }
    },
    template: jetpack.read('./components/test/comp2.vue.html')
});