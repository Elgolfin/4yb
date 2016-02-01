// Here is the starting point for code of your own application.
// All stuff below is just to show you how it works. You can delete all of it.

// Modules which you authored in this project are intended to be
// imported through new ES6 syntax.
//import { greet } from './testImport.js';
//console.log(greet());

// Node.js modules and those from npm
// are required the same way as always.
const app = require('remote').require('app')
const jetpack = require('fs-jetpack').cwd(app.getAppPath())

// Holy crap! This is browser window with HTML and stuff, but I can read
// here files like it is node.js! Welcome to Electron world :)
//console.log(jetpack.read('package.json', 'json'))

const Vue = require('vue');

var db_4yb = require('remote').getGlobal('db_4yb');
var db_4yb_filename = require('remote').getGlobal('openedFile');
//alert(db_4yb);

// Load all components
var comp1 = require('./components/comp1.vue.js').comp1;
var comp2 = require('./components/comp2.vue.js').comp2;
var comp3 = require('./components/comp3.vue.js').comp3;
var listAccounts = require('./components/account/list.vue.js').ListAccounts;
var sidebar = require('./components/sidebar.vue.js').sidebar;

// Register components
var mainVM = new Vue({
    el: 'body',
    data: {
        currentView: 'comp2'
    },
    components: {
        comp1: comp1,
        comp2: comp2,
        comp3: comp3,
        listAccounts: listAccounts,
        comp4ybSidebar: sidebar
    }
})