/* global describe, it */
var should = require('chai').should();
var alphabet = require('../js/alphabet.js').alphabet;

describe('Alphabet', function() {
    describe('getNextEntry method', function() {
        it('returns b when input is a', function() {
            alphabet.getNextEntry('a').should.equal('b');
        });
        it('returns a.b when input is a.a', function() {
            alphabet.getNextEntry('a.a').should.equal('a.b');
        });
        it('returns ab when input is aa', function() {
            alphabet.getNextEntry('aa').should.equal('ab');
        });
        ;
        /*
        it('returns aa when input is z', function() {
            alphabet.getNextEntry('z').should.equal('aa');
        });
        */
    });
});