import { Alphabet } from 'src/lib/Alphabet'

describe('Alphabet', function () {
  describe('Method getNextEntry:', function () {
    it(' Returns b when input is a', function () {
      Alphabet.getNextEntry('a').should.equal('b')
    })
    it(' Returns a.b when input is a.a', function () {
      Alphabet.getNextEntry('a.a').should.equal('a.b')
    })
    it(' Returns a.aa when input is a.z', function () {
      Alphabet.getNextEntry('a.z').should.equal('a.aa')
    })
    it(' Returns ab when input is aa', function () {
      Alphabet.getNextEntry('aa').should.equal('ab')
    })
  })
  describe('Method getParentPath:', function () {
    it(' Returns empty when input is undefined', function () {
      Alphabet.getParentPath().should.equal('')
    })
    it(' Returns a when input is a.b', function () {
      Alphabet.getParentPath('a.b').should.equal('a')
    })
    it(' Returns empty when input is a', function () {
      Alphabet.getParentPath('a').should.equal('')
    })
  })
  describe('Method increments:', function () {
    it(' Returns b when incrementing a', function () {
      Alphabet.increments('a').should.equal('b')
    })
    it(' Returns aa when incrementing z', function () {
      Alphabet.increments('z').should.equal('aa')
    })
    it(' Returns when incrementing aa', function () {
      Alphabet.increments('aa').should.equal('ab')
    })
    it(' Returns az when incrementing ay', function () {
      Alphabet.increments('ay').should.equal('az')
    })
    it(' Returns ba when incrementing az', function () {
      Alphabet.increments('az').should.equal('ba')
    })
    it(' Returns aaaaa when incrementing zzzz', function () {
      Alphabet.increments('zzzz').should.equal('aaaaa')
    })
    it(' Returns empty when incrementing null', function () {
      Alphabet.increments(null).should.equal('')
    })
    it(' Returns empty when incrementing empty', function () {
      Alphabet.increments('').should.equal('')
    })
  })
})
