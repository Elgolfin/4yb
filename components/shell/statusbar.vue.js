/* global process, db_4yb_filepath */
const app = require('electron').remote.app;
const jetpack = require('fs-jetpack').cwd(app.getAppPath());
var Vue = require('vue');
var mixin = require('../../mixins/mixins.js').mixin;

exports.statusbar = Vue.extend({
    data: function () {
        return { 
            openedFile: db_4yb_filepath,
            electronVersion: process.versions['electron']
        }
    },
    template: jetpack.read('./components/shell/statusbar.vue.html'),
    methods: {
        
    },
    mixins: [mixin]
});