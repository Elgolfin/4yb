const app = require('remote').require('app');
const jetpack = require('fs-jetpack').cwd(app.getAppPath());
var Vue = require('vue');

//var Datastore = require('nedb'), db = new Datastore({ filename: 'test.json', autoload: true });

exports.sidebar = Vue.extend({
    data: function () {
        return { menuTitle: "4yb" }
    },
    template: jetpack.read('./components/sidebar.vue.html'),
    methods: {
        removeUser: null /*function (user) {
            db.find({}).sort({ id: -1 }).exec(function (err, docs) {
                    console.log(docs);
            });
        }*/,
        changeView: function (view) {
            console.log("Change view from " + this.$root.currentView + " to " + view);
            this.$root.currentView = view;
        }
    }
});