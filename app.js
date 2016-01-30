// Here is the starting point for code of your own application.
// All stuff below is just to show you how it works. You can delete all of it.

// Modules which you authored in this project are intended to be
// imported through new ES6 syntax.
//import { greet } from './HelloWorld'
//console.log(greet())

// Node.js modules and those from npm
// are required the same way as always.
//const app = require('remote').require('app')
//const jetpack = require('fs-jetpack').cwd(app.getAppPath())

// Holy crap! This is browser window with HTML and stuff, but I can read
// here files like it is node.js! Welcome to Electron world :)
//console.log(jetpack.read('package.json', 'json'))

const Vue = require('vue')



// define
var MyComponent = Vue.extend({
  template: '<div>A custom component!</div>'
})

// register
Vue.component('my-component', MyComponent)

// create a root instance
new Vue({
  el: '#example'
})


// this is our Model
var exampleData = {
  name: 'Vue.vue'
}

// create a Vue instance, or, a "ViewModel"
// which links the View and the Model
var exampleVM = new Vue({
  el: '#example-1',
  data: exampleData
})