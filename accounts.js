const Vue = require('vue')


var Datastore = require('nedb'), db = new Datastore({ filename: 'test.json', autoload: true });
var accounts;
db.find({}).sort({ id: -1 }).exec(function (err, docs) {
        accounts = docs;
        var accountVue = new Vue({
            el: '#accounts',
            data: {
                accounts: accounts
            },

            // methods
            methods: {
                deleteAccount: function (account) {
                    console.log("delete " + account._id);
                    db.remove({ _id: account._id }, {}, function (err, numRemoved) {
                        // numRemoved = 1
                        accountVue.accounts.$remove(account);
                    });
                }
            }
        })
});
