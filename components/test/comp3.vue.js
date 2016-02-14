/* global Bloodhound */
const app = require('remote').require('app');
const jetpack = require('fs-jetpack').cwd(app.getAppPath());
var Vue = require('vue');
var $ = window.$ = window.jQuery = require('../../js/jquery-1.12.0.min.js');

exports.comp3 = Vue.extend({
    data: function () {
        return { title: "comp3 title", comp3: "comp3" }
    },
    template: jetpack.read('./components/test/comp3.vue.html'),
    ready: function() {
        var vm = this;
        new Vue({
            el: '#typeahead',
            components: {
                comp4ybTypeahead: exports.typeahead
            },
            parent: vm,
        });
    }
});

exports.typeahead = Vue.component('comp-4yb-typeahead', {
    data: function() {
        return {
            title: "TYPE A HEAD :)"
        }
    },
    template: jetpack.read('./components/test/typeahead.vue.html'),
    methods: {
        
    },
    ready: function () {
        console.log($);
        /*
        $('#the-basics .typeahead').typeahead({
            hint: true,
            highlight: true,
            minLength: 1
        },
        {
            name: 'states',
            source: substringMatcher(states)
        });
        */
        $('#bloodhound .typeahead').typeahead({
            hint: true,
            highlight: true,
            minLength: 1
        },
        {
            name: 'statesBH',
            source: statesBH
        });
        
    }
});


var substringMatcher = function(strs) {
  return function findMatches(q, cb) {
    var matches, substrRegex;

    // an array that will be populated with substring matches
    matches = [];

    // regex used to determine if a string contains the substring `q`
    substrRegex = new RegExp(q, 'i');

    // iterate through the pool of strings and for any string that
    // contains the substring `q`, add it to the `matches` array
    $.each(strs, function(i, str) {
      if (substrRegex.test(str)) {
        matches.push(str);
      }
    });

    cb(matches);
  };
};

var states = ['Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California',
  'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii',
  'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana',
  'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota',
  'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire',
  'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota',
  'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island',
  'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont',
  'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'
];

// constructs the suggestion engine
var statesBH = new Bloodhound({
  datumTokenizer: Bloodhound.tokenizers.whitespace,
  queryTokenizer: Bloodhound.tokenizers.whitespace,
  // `states` is an array of state names defined in "The Basics"
  local: ['Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California',
  'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii',
  'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana',
  'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota',
  'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire',
  'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota',
  'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island',
  'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont',
  'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'
]
});


