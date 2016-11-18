'use strict'

let AccountManager = exports.AccountManager = function (db) {
  this.db = db
  this.excludedAccount = null // A path (string) or an array of path (array of strings)
  this.rootAccount = 'a' // A path (string)
  this.accountType = []
  return this
}

AccountManager.prototype.getAll = function () {
  let callback = function () { }
  let getAccounts = buildTreeList
  let numArgs = arguments.length
  if (numArgs === 1) {
    callback = arguments[0]
  }
  if (numArgs > 1) {
    getAccounts = arguments[0]
    callback = arguments[1]
  }

  // Build the query
  let rootAccount = this.rootAccount
  let regex = new RegExp('^' + rootAccount + '\\.')
  let query = { entity: 'account', path: regex }
  // TODO support excludedAccount
  /* if (typeof this.excludedAccount === 'string') {
    query = { entity: 'account', $and: [{path: regex}, {path: { $ne: this.excludedAccount }}] }
  }

  if (Array.isArray(this.excludedAccount)) {
    query = { entity: 'account', $and: [{path: regex}, {path: { $nin: this.excludedAccount }}] }
  } */

  if (Array.isArray(this.accountType) && this.accountType.length > 0) {
    query.type = { $in: this.accountType }
  }

  // Retrieve the accounts
  this.db.findAsync(query).sort({ name: 1 }).execAsync().then(function (docs) {
    let accountsTree = getAccounts(rootAccount, JSON.parse(JSON.stringify(docs)))
    callback(accountsTree)
  })
}

AccountManager.prototype.getAll_FlatList = function (callback) {
  AccountManager.prototype.getAll.call(this, buildFlatList, function (accounts) {
    callback(accounts)
  })
}

AccountManager.prototype.getAll_TreeList = function (callback) {
  AccountManager.prototype.getAll.call(this, buildTreeList, function (accounts) {
    callback(accounts)
  })
}

AccountManager.prototype.getAll_Default = function (callback) {
  AccountManager.prototype.getAll.call(this, buildDefault, function (accounts) {
    callback(accounts)
  })
}

AccountManager.prototype.getAll_Hash = function (callback) {
  AccountManager.prototype.getAll.call(this, buildHash, function (accounts) {
    callback(accounts)
  })
}

AccountManager.prototype.getAll_ArrayOfPath = function (callback) {
  AccountManager.prototype.getAll.call(this, buildArrayOfPath, function (accounts) {
    callback(accounts)
  })
}

/*
path = the path of the account (i.e. : a, a.a, a.b.c, etc.)
data = the list of the accounts (each account has a property called path which refers to its path in the tree)
*/
function buildFlatList (path, data, indent) {
  var ret = []
  indent = indent || 0
  data.forEach(function (entry, index) {
    if (entry.parent === path) {
      let txtIndent = ''
      for (let i = 0; i < indent; i++) {
        txtIndent += '&dash;&dash;'
      }
      ret.push({account: entry, indent: txtIndent})
      let children = buildFlatList(entry.path, data, indent + 1)
      children.forEach(function (entry, index) {
        ret.push({account: entry.account, indent: entry.indent})
      })
    }
  })
  return ret
}

/*
path = the path of the account (i.e. : a, a.a, a.b.c, etc.)
data = the list of the accounts (each account has a property called path which refers to its path in the tree)
*/
function buildTreeList (path, data) {
  var ret = []
  data.forEach(function (entry) {
    if (entry.parent === path) {
      ret.push({account: entry, children: buildTreeList(entry.path, data)})
    }
  })
  return ret
}

function buildDefault (path, data) {
  var ret = []
  data.forEach(function (entry) {
    ret.push(entry)
  })
  return ret
}

function buildHash (path, data) {
  var ret = {}
  data.forEach(function (entry) {
    ret[entry.path] = entry
  })
  return ret
}

function buildArrayOfPath (path, data) {
  var ret = []
  data.forEach(function (entry) {
    ret.push(entry.path)
  })
  return ret
}
