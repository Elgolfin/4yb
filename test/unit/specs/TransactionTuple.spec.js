/* global describe, it, before, after, expect */
'use strict'
var assert = require('chai').assert
import { TransactionTuple } from 'src/lib/TransactionTuple'
import { Db4yb } from 'src/lib/Db4yb'

let db4yb
let testData = [
  {
    _id: '1aNHWb22sL0jX7zg',
    _group: '1aNHWb22sL0jX7zg',
    code: 'c',
    description: 'd',
    note: 'n',
    transaction_date: new Date(2016, 1, 1),
    posted_date: new Date(2016, 1, 5),
    recognition_date: null,
    transfer: 'a.a',
    debit: 100.01,
    credit: 0,
    entity: 'transaction',
    city: 'Montréal',
    state: 'QC',
    country: 'Canada',
    zipcode: 'A1B 2C3'
  },
  {
    _id: '2aNHWb22sL0jX7zg',
    _group: '1aNHWb22sL0jX7zg',
    code: 'c',
    description: 'd',
    note: 'n',
    transaction_date: new Date(2016, 1, 1),
    posted_date: new Date(2016, 1, 5),
    recognition_date: null,
    transfer: 'a.b',
    debit: 100.01,
    credit: 0,
    entity: 'transaction',
    city: 'Montréal',
    state: 'QC',
    country: 'Canada',
    zipcode: 'A1B 2C3'
  }
]

describe('Transaction Tuple', function () {
  before(function (done) {
    db4yb = new Db4yb().load().Datastore // db in-memory
    // db4yb = new Db4yb().load('test.db.' + (new Date).getTime() + '.json').Datastore; // db file
    db4yb.insert(testData, function (err, newDoc) {
      if (err) { }
      done()
    })
  })

  after(function (done) {
    db4yb.loadDatabase(function () {
      done()
    })
  })

  describe('Transaction Tuple CRUD', function () {
    it('returns an empty transaction tuple', function () {
      var transactionTuple = new TransactionTuple(db4yb)
      assert.isNull(transactionTuple.currentTransaction._id)
      assert.isNull(transactionTuple.twinTransaction._id)
    })

    it('get an existing transaction tuple 1/2', function (done) {
      var transactionTuple = new TransactionTuple(db4yb)
      transactionTuple.get('1aNHWb22sL0jX7zg', {path: 'a.a', type: 'ASSET'}, function () {
        assert.strictEqual(transactionTuple.currentTransaction._id, '1aNHWb22sL0jX7zg')
        assert.strictEqual(transactionTuple.twinTransaction._id, '2aNHWb22sL0jX7zg')
        done()
      })
    })

    it('get an existing transaction tuple 2/2 (transactions will be reversed in the tuple)', function (done) {
      var transactionTuple = new TransactionTuple(db4yb)
      transactionTuple.get('1aNHWb22sL0jX7zg', {path: 'a.b', type: 'ASSET'}, function () {
        assert.strictEqual(transactionTuple.currentTransaction._id, '2aNHWb22sL0jX7zg')
        assert.strictEqual(transactionTuple.twinTransaction._id, '1aNHWb22sL0jX7zg')
        done()
      })
    })

    it('save a first new transaction (ASSET -> CC)', function (done) {
      var transaction = {
        code: 'c1',
        description: 'd1',
        note: 'n1',
        transaction_date: new Date(2016, 2, 1),
        posted_date: new Date(2016, 2, 3),
        recognition_date: null,
        transfer: {path: 'b.a', type: 'ASSET'},
        debit: 112.49,
        credit: 0,
        city: 'Montréal',
        state: 'QC',
        country: 'Canada',
        zipcode: 'A1B 2C3'
      }
      var linkedTransfer = {path: 'b.c', type: 'CC'}
      var transactionTuple = new TransactionTuple(db4yb).load(transaction, {transfer: linkedTransfer})
      transactionTuple.add(function (savedTransaction) {
        assert.isString(transactionTuple.currentTransaction._id)
        assert.match(transactionTuple.currentTransaction._id, /[a-z0-9]{16}/i)
        assert.isString(transactionTuple.twinTransaction._id)
        assert.match(transactionTuple.twinTransaction._id, /[a-z0-9]{16}/i)
        assert.notStrictEqual(transactionTuple.currentTransaction._id, transactionTuple.twinTransaction._id)

        assert.strictEqual(transactionTuple.currentTransaction.transfer.path, 'b.a')
        assert.strictEqual(transactionTuple.twinTransaction.transfer.path, 'b.c')
        assert.strictEqual(savedTransaction.currentTransaction.transfer, 'b.a')
        assert.strictEqual(savedTransaction.twinTransaction.transfer, 'b.c')

        assert.strictEqual(transactionTuple.currentTransaction.debit, 112.49)
        assert.strictEqual(transactionTuple.currentTransaction.credit, 0)
        assert.strictEqual(transactionTuple.twinTransaction.debit, 0)
        assert.strictEqual(transactionTuple.twinTransaction.credit, 112.49)

        assert.strictEqual(transactionTuple.currentTransaction.city, 'Montréal')
        assert.strictEqual(transactionTuple.currentTransaction.state, 'QC')
        assert.strictEqual(transactionTuple.currentTransaction.country, 'Canada')
        assert.strictEqual(transactionTuple.currentTransaction.zipcode, 'A1B 2C3')

        done()
      })
    })

    it('save a second new transaction (CC -> EXP)', function (done) {
      var transaction = {
        code: 'c2',
        description: 'd2',
        note: 'n2',
        transaction_date: new Date(2016, 2, 28),
        posted_date: new Date(2016, 3, 2),
        recognition_date: null,
        transfer: {path: 'b.c', type: 'CC'},
        debit: 99.99,
        credit: 0,
        city: 'Montréal',
        state: 'QC',
        country: 'Canada',
        zipcode: 'A1B 2C3'
      }
      var linkedTransfer = {path: 'c.a', type: 'EXP'}
      var transactionTuple = new TransactionTuple(db4yb).load(transaction, {transfer: linkedTransfer})
      transactionTuple.save(function (savedTransaction) {
        assert.isString(transactionTuple.currentTransaction._id)
        assert.match(transactionTuple.currentTransaction._id, /[a-z0-9]{16}/i)
        assert.isString(transactionTuple.twinTransaction._id)
        assert.match(transactionTuple.twinTransaction._id, /[a-z0-9]{16}/i)
        assert.notStrictEqual(transactionTuple.currentTransaction._id, transactionTuple.twinTransaction._id)

        assert.strictEqual(transactionTuple.currentTransaction.transfer.path, 'b.c')
        assert.strictEqual(transactionTuple.twinTransaction.transfer.path, 'c.a')
        assert.strictEqual(savedTransaction.currentTransaction.transfer, 'b.c')
        assert.strictEqual(savedTransaction.twinTransaction.transfer, 'c.a')

        assert.strictEqual(transactionTuple.currentTransaction.debit, 99.99)
        assert.strictEqual(transactionTuple.currentTransaction.credit, 0)
        assert.strictEqual(transactionTuple.twinTransaction.debit, 99.99)
        assert.strictEqual(transactionTuple.twinTransaction.credit, 0)
        done()
      })
    })

    it('save a third new transaction (BANK -> BANK)', function (done) {
      var transaction = {
        code: 'c3',
        description: 'd3',
        note: 'n3',
        transaction_date: new Date(2016, 2, 28),
        posted_date: new Date(2016, 3, 2),
        recognition_date: null,
        transfer: {path: 'b.c', type: 'BANK'},
        debit: 99.33,
        credit: 0,
        city: 'Montréal',
        state: 'QC',
        country: 'Canada',
        zipcode: 'A1B 2C3'
      }
      var linkedTransfer = {path: 'c.a', type: 'BANK'}
      var transactionTuple = new TransactionTuple(db4yb).load(transaction, {transfer: linkedTransfer})
      transactionTuple.save(function (savedTransaction) {
        assert.isString(transactionTuple.currentTransaction._id)
        assert.match(transactionTuple.currentTransaction._id, /[a-z0-9]{16}/i)
        assert.isString(transactionTuple.twinTransaction._id)
        assert.match(transactionTuple.twinTransaction._id, /[a-z0-9]{16}/i)
        assert.notStrictEqual(transactionTuple.currentTransaction._id, transactionTuple.twinTransaction._id)

        assert.strictEqual(transactionTuple.currentTransaction.transfer.path, 'b.c')
        assert.strictEqual(transactionTuple.twinTransaction.transfer.path, 'c.a')
        assert.strictEqual(savedTransaction.currentTransaction.transfer, 'b.c')
        assert.strictEqual(savedTransaction.twinTransaction.transfer, 'c.a')

        assert.strictEqual(transactionTuple.currentTransaction.debit, 99.33)
        assert.strictEqual(transactionTuple.currentTransaction.credit, 0)
        assert.strictEqual(transactionTuple.twinTransaction.debit, 0)
        assert.strictEqual(transactionTuple.twinTransaction.credit, 99.33)
        done()
      })
    })

    it('save a fourth new transaction (ASSET -> ASSET)', function (done) {
      var transaction = {
        code: 'c4',
        description: 'd4',
        note: 'n4',
        transaction_date: new Date(2016, 2, 28),
        posted_date: new Date(2016, 3, 2),
        recognition_date: null,
        transfer: {path: 'b.c', type: 'ASSET'},
        debit: 99.44,
        credit: 0,
        city: 'Montréal',
        state: 'QC',
        country: 'Canada',
        zipcode: 'A1B 2C3'
      }
      var linkedTransfer = {path: 'c.a', type: 'ASSET'}
      var transactionTuple = new TransactionTuple(db4yb).load(transaction, {transfer: linkedTransfer})
      transactionTuple.save(function (savedTransaction) {
        assert.isString(transactionTuple.currentTransaction._id)
        assert.match(transactionTuple.currentTransaction._id, /[a-z0-9]{16}/i)
        assert.isString(transactionTuple.twinTransaction._id)
        assert.match(transactionTuple.twinTransaction._id, /[a-z0-9]{16}/i)
        assert.notStrictEqual(transactionTuple.currentTransaction._id, transactionTuple.twinTransaction._id)

        assert.strictEqual(transactionTuple.currentTransaction.transfer.path, 'b.c')
        assert.strictEqual(transactionTuple.twinTransaction.transfer.path, 'c.a')
        assert.strictEqual(savedTransaction.currentTransaction.transfer, 'b.c')
        assert.strictEqual(savedTransaction.twinTransaction.transfer, 'c.a')

        assert.strictEqual(transactionTuple.currentTransaction.debit, 99.44)
        assert.strictEqual(transactionTuple.currentTransaction.credit, 0)
        assert.strictEqual(transactionTuple.twinTransaction.debit, 0)
        assert.strictEqual(transactionTuple.twinTransaction.credit, 99.44)
        done()
      })
    })
  })
})
