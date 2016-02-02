const app = require('remote').require('app');
const jetpack = require('fs-jetpack').cwd(app.getAppPath());
var Vue = require('vue');

exports.main = Vue.extend({
    data: function () {
        return { title: "Graph", graph: "graph" }
    },
    template: jetpack.read('./components/graph/main.vue.html')
});