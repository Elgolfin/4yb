/* global describe, it, beforeAll, afterAll, expect */
'use strict'
var assert = require('chai').assert
import { AccountManager } from 'app/js/AccountManager'
import { Db4yb } from 'app/js/Db4yb'
const jetpack = require('fs-jetpack').cwd('test/unit/specs/testdata')

let db4yb
let testData = jetpack.read('./AccountManager.test.data.json', 'jsonWithDates')

describe('Account Manager', function () {
  beforeAll(function (done) {
    db4yb = new Db4yb().load().Datastore // db in-memory
    // db4yb = new Db4yb().load('test.db.' + (new Date).getTime() + '.json').Datastore; // db file
    db4yb.insert(testData, function (err, newDoc) {
      if (err) { }
      done()
    })
  })

  afterAll(function (done) {
    db4yb.loadDatabase(function () {
      done()
    })
  })

  describe('Get Methods', function () {
    it(' Returns all accounts (65)', function () {
      let accountManager = new AccountManager(db4yb)
      accountManager.getAll_Default(function (accounts) {
        assert.strictEqual(accounts.length, 65)
      })
    })

    it(' Returns expense and income accounts only (10 + 40)', function () {
      let accountManager = new AccountManager(db4yb)
      accountManager.accountType = ['INC', 'EXP']
      accountManager.getAll_Default(function (accounts) {
        assert.strictEqual(accounts.length, 10 + 40)
      })
    })

    it(' Returns all accounts in an hashtable', function () {
      let accountManager = new AccountManager(db4yb)
      accountManager.getAll_Hash(function (accounts) {
        assert.strictEqual(accounts['a.c'].name, 'Expenses')
      })
    })

    it(' Returns all accounts in an array of path', function () {
      let accountManager = new AccountManager(db4yb)
      accountManager.accountType = ['INC', 'EXP']
      accountManager.getAll_ArrayOfPath(function (accounts) {
        assert.strictEqual(accounts.length, 10 + 40)
      })
    })

    it(' Returns all as a tree list (5 level one account)', function () {
      let accountManager = new AccountManager(db4yb)
      accountManager.getAll_TreeList(function (accounts) {
        assert.strictEqual(accounts.length, 5)
      })
    })

    it(' Returns all as a tree list (5 level one account)', function () {
      let accountManager = new AccountManager(db4yb)
      accountManager.getAll(function (accounts) {
        assert.strictEqual(accounts.length, 5)
      })
    })

    it(' Returns all accounts as a flat list (65)', function () {
      let accountManager = new AccountManager(db4yb)
      accountManager.getAll_FlatList(function (accounts) {
        assert.strictEqual(accounts.length, 65)
      })
    })
    /* it(' Returns expected tree list when input is good', function () {
      var ret = [{path: 'a.a', parent: 'a'}, {path: 'a.a.a', parent: 'a.a'}]
      var assert = [{account: {parent: 'a', path: 'a.a'}, children: [{account: {path: 'a.a.a', parent: 'a.a'}, children: []}]}]
      alphabet.buildTreeList('a', ret).should.eql(assert)
    }) */
  })
})
