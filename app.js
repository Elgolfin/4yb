// Here is the starting point for code of your own application.
// All stuff below is just to show you how it works. You can delete all of it.

// Modules which you authored in this project are intended to be
// imported through new ES6 syntax.
//import { greet } from './HelloWorld.js';
//console.log(greet());

// Node.js modules and those from npm
// are required the same way as always.
const app = require('remote').require('app')
const jetpack = require('fs-jetpack').cwd(app.getAppPath())

// Holy crap! This is browser window with HTML and stuff, but I can read
// here files like it is node.js! Welcome to Electron world :)
//console.log(jetpack.read('package.json', 'json'))

const Vue = require('vue');
	
Vue.filter('upper', function (value) {
    return value.toUpperCase();
});
 
Vue.filter('lower', function (value) {
    return value.toLowerCase();
});  
  
// Define and register the component in one step
Vue.component('component-4yb-menu', {
  template: jetpack.read('./components/sidebar.vue.html'),
  data: function data() { 
      return {
        menuTitle: '4yb'
    }
  },
    filters: {
        upp: function(value) {
            return value.toUpperCase();
        },

        low: function(value) {
            return value.toLowerCase();
        }
    },

  // methods
  methods: {
   
    removeUser: function (user) {
        db.find({}).sort({ id: -1 }).exec(function (err, docs) {
                console.log(docs);
        });

      
    },
    addUser: function () {
      
    }
  }
  
})


// create a Vue instance, or, a "ViewModel"
// which links the View and the Model
var menuVM = new Vue({
    el: '#menu'
})


var Datastore = require('nedb'), db = new Datastore({ filename: 'test.json', autoload: true });