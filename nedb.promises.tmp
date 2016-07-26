const bb = require('bluebird');
const Datastore = require('nedb');

exports.PromiseDatastore = function (options) {
    var DB = new Datastore(options)
	DB = bb.Promise.promisifyAll(DB)

	DB.findAsync = function(spec, opts) {
		var c = DB.find(spec, opts)
		c.execAsync = bb.Promise.promisify(c.exec, c)
		return c
	}

	DB.findOneAsync = function(spec, opts) {
		var c = DB.findOne(spec, opts)
		c.execAsync = bb.Promise.promisify(c.exec, c)
		return c
	}

	return DB
}