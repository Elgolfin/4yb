import { alphabet } from 'app/js/alphabet'

describe('Alphabet', function () {
  describe('getNextEntry method', function () {
    it('returns b when input is a', function () {
      alphabet.getNextEntry('a').should.equal('b')
    })
    it('returns a.b when input is a.a', function () {
      alphabet.getNextEntry('a.a').should.equal('a.b')
    })
    it('returns a.aa when input is a.z', function () {
      alphabet.getNextEntry('a.z').should.equal('a.aa')
    })
    it('returns ab when input is aa', function () {
      alphabet.getNextEntry('aa').should.equal('ab')
    })
    /*
    it('returns aa when input is z', function () {
      alphabet.getNextEntry('z').should.equal('aa')
    })
    */
  })
  describe('getParentPath method', function () {
    it('returns empty when input is undefined', function () {
      alphabet.getParentPath().should.equal('')
    })
    /*
    it('returns aa when input is z', function () {
      alphabet.getNextEntry('z').should.equal('aa')
    })
    */
  })
  describe('Increments', function () {
    it('Increment a returns b', function () {
      alphabet.increments('a').should.equal('b')
    })
    it('Increment z returns aa', function () {
      alphabet.increments('z').should.equal('aa')
    })
    it('Increment aa returns ab', function () {
      alphabet.increments('aa').should.equal('ab')
    })
    it('Increment ay returns az', function () {
      alphabet.increments('ay').should.equal('az')
    })
    it('Increment az returns ba', function () {
      alphabet.increments('az').should.equal('ba')
    })
    it('Increment zzzz returns aaaaa', function () {
      alphabet.increments('zzzz').should.equal('aaaaa')
    })
  })
})
