var Vue = require("vue");
var Promise = require("bluebird");

var url = require('url');
var url_parts = url.parse(window.location.pathname + window.location.search, true);

var query = url_parts.query;
console.log(query);

var Datastore = require('nedb'), db = new Datastore({ filename: 'test.json', autoload: true, timestampData: true });

var accountData;


db.findOne({ _id: query._id }, function (err, doc) {
    if (err) {console.log(err)}
    else {
        console.log(doc);
        if (doc) {
            accountData = doc;
        } else {
            accountData = {name: "", code: "", type:"", parent:"", description: "", hidden:"", placeholder:"", active:""}
        }
        new Vue({
            el: '#account',
            data: accountData,

            // methods
            methods: {
                updateAccount: function () {
                    console.log(accountData.name);
                    console.log(accountData._id);
                    
                    db.update({ _id: accountData._id }, accountData, {upsert: true}, function (err, numReplaced) {
                        console.log(err);
                        console.log(numReplaced);
                    });
                    
                }
            }
        });
    }
});
    
    



