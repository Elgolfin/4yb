const bb = require('bluebird');
const Datastore = require('nedb');

exports.PromiseDatastore = function (options) {
    var DB = new Datastore(options)
	DB = bb.Promise.promisifyAll(DB)

	DB.cfind = function(spec, opts) {
		var c = DB.find(spec, opts)
		c.execAsync = bb.Promise.promisify(c.exec, c)
		return c
	}

	DB.cfindOne = function(spec, opts) {
		var c = DB.findOne(spec, opts)
		c.execAsync = bb.Promise.promisify(c.exec, c)
		return c
	}

	return DB
}