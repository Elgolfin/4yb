const app = require('remote').require('app');
const jetpack = require('fs-jetpack').cwd(app.getAppPath());
var Vue = require('vue');
var mixin = require('../../mixins/mixins.js').mixin;

//var Datastore = require('nedb'), db = new Datastore({ filename: 'test.json', autoload: true });

exports.statusbar = Vue.extend({
    data: function () {
        return { 
            openedFile: db_4yb_filepath
        }
    },
    template: jetpack.read('./components/shell/statusbar.vue.html'),
    methods: {
        
    },
    mixins: [mixin]
});