const app = require('remote').require('app');
const jetpack = require('fs-jetpack').cwd(app.getAppPath());
var Vue = require('vue');
var mixin = require('../../mixins/mixins.js').mixin;

//var Datastore = require('nedb'), db = new Datastore({ filename: 'test.json', autoload: true });

exports.sidebar = Vue.extend({
    data: function () {
        return { 
            menuTitle: "4yb",
            links: jetpack.read('./components/shell/sidebar.vue.json','json'),
        }
    },
    computed: {
        currentView: function () {
            return this.$root.currentView
        }
    },
    template: jetpack.read('./components/shell/sidebar.vue.html'),
    methods: {
        /*changeView: function (view) {
            console.log("Change view from " + this.$root.currentView + " to " + view);
            this.$root.currentView = view;
        }*/
    },
    mixins: [mixin]
});