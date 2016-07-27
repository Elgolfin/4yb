import { alphabet } from 'app/js/alphabet'

describe('Alphabet', function () {
  describe('Method getNextEntry:', function () {
    it(' Returns b when input is a', function () {
      alphabet.getNextEntry('a').should.equal('b')
    })
    it(' Returns a.b when input is a.a', function () {
      alphabet.getNextEntry('a.a').should.equal('a.b')
    })
    it(' Returns a.aa when input is a.z', function () {
      alphabet.getNextEntry('a.z').should.equal('a.aa')
    })
    it(' Returns ab when input is aa', function () {
      alphabet.getNextEntry('aa').should.equal('ab')
    })
  })
  describe('Method getParentPath:', function () {
    it(' Returns empty when input is undefined', function () {
      alphabet.getParentPath().should.equal('')
    })
    it(' Returns a when input is a.b', function () {
      alphabet.getParentPath('a.b').should.equal('a')
    })
    it(' Returns empty when input is a', function () {
      alphabet.getParentPath('a').should.equal('')
    })
  })
  describe('Method increments:', function () {
    it(' Returns b when incrementing a', function () {
      alphabet.increments('a').should.equal('b')
    })
    it(' Returns aa when incrementing z', function () {
      alphabet.increments('z').should.equal('aa')
    })
    it(' Returns when incrementing aa', function () {
      alphabet.increments('aa').should.equal('ab')
    })
    it(' Returns az when incrementing ay', function () {
      alphabet.increments('ay').should.equal('az')
    })
    it(' Returns ba when incrementing az', function () {
      alphabet.increments('az').should.equal('ba')
    })
    it(' Returns aaaaa when incrementing zzzz', function () {
      alphabet.increments('zzzz').should.equal('aaaaa')
    })
    it(' Returns empty when incrementing null', function () {
      alphabet.increments(null).should.equal('')
    })
    it(' Returns empty when incrementing empty', function () {
      alphabet.increments('').should.equal('')
    })
  })
  describe('Method buildFlatList:', function () {
    it(' Returns empty when input is bad', function () {
      var ret = [{path: 'a'}, {path: 'a.a'}]
      var assert = []
      alphabet.buildFlatList('a', ret).should.eql(assert)
    })
    it(' Returns expected flat list when input is good', function () {
      var ret = [{path: 'a.a', parent: 'a'}, {path: 'a.a.a', parent: 'a.a'}]
      var assert = [{account: {parent: 'a', path: 'a.a'}, indent: ''}, {account: {parent: 'a.a', path: 'a.a.a'}, indent: '&dash;&dash;'}]
      alphabet.buildFlatList('a', ret).should.eql(assert)
    })
  })
  describe('Method buildTreeList:', function () {
    it(' Returns empty when input is bad', function () {
      var ret = [{path: 'a'}, {path: 'a.a'}]
      var assert = []
      alphabet.buildTreeList('a', ret).should.eql(assert)
    })
    it(' Returns expected tree list when input is good', function () {
      var ret = [{path: 'a.a', parent: 'a'}, {path: 'a.a.a', parent: 'a.a'}]
      var assert = [{account: {parent: 'a', path: 'a.a'}, children: [{account: {path: 'a.a.a', parent: 'a.a'}, children: []}]}]
      alphabet.buildTreeList('a', ret).should.eql(assert)
    })
  })
})
