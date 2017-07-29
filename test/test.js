'use strict';

var naturalCompare = require('../');
var should = require('should');

should.Assertion.add('greaterThan', function(value, message) {
  this.params = {operator: 'to be greater than ' + value};

  should.ok(this.obj > value, message);
});

should.Assertion.add('lessThan', function(value, message) {
  this.params = {operator: 'to be less than ' + value};

  should.ok(this.obj < value, message);
});

function verify(testData) {
  var a = testData[0];
  var b = testData[2];
  var failMessage = 'failure on input: [' + testData.join(' ') + ']';

  switch (testData[1]) {
    case '=':
      naturalCompare(a, b).should.equal(0, failMessage);
      naturalCompare.caseInsensitive(a, b).should.equal(0, failMessage);
      break;
    case '>':
      naturalCompare(a, b).should.be.greaterThan(0, failMessage);
      naturalCompare.caseInsensitive(a, b).should.be.greaterThan(0, failMessage);
      break;
    case '<':
      naturalCompare(a, b).should.be.lessThan(0, failMessage);
      naturalCompare.caseInsensitive(a, b).should.be.lessThan(0, failMessage);
      break;
    default:
      should.ok(false, 'Unknown expected result: ' + testData[1]);
  }
}

describe('naturalCompare() and naturalCompare.caseInsensitive()', function() {
  it('should compare strings that do not contain numbers', function() {
    [
      ['a', '=', 'a'],
      ['a', '<', 'b'],
      ['b', '>', 'a'],
      ['a', '<', 'aa'],
      ['aa', '>', 'a'],
      ['a', '<', 'ba'],
      ['ba', '>', 'a'],
      ['aa', '<', 'b'],
      ['b', '>', 'aa'],
      ['aa', '<', 'ba'],
      ['ba', '>', 'aa'],
    ].forEach(verify);
  });

  it('should compare integer substrings by their numeric value', function() {
    [
      ['1', '=', '1'],
      ['50', '=', '50'],
      ['11001', '>', '1102'],
      ['a', '<', 'a1'],
      ['a1', '>', 'a'],
      ['1', '<', 'a'],
      ['a', '>', '1'],
      ['2', '<', '3'],
      ['3', '>', '2'],
      ['2', '<', '10'],
      ['10', '>', '2'],
      ['a1', '=', 'a1'],
      ['a1', '<', 'a2'],
      ['a2', '>', 'a1'],
      ['a1', '<', 'a11'],
      ['a11', '>', 'a1'],
      ['a11', '<', 'a12'],
      ['a12', '>', 'a11'],
      ['a1', '<', 'a1a'],
      ['a1a', '>', 'a1'],
      ['a1a', '<', 'a11'],
      ['a11', '>', 'a1a'],
      ['a1a', '<', 'a11a'],
      ['a11a', '>', 'a1a'],
    ].forEach(verify);
  });

  it('should work with 0 in the string', function() {
    [
      ['a00', '<', 'a000'],
      ['a 0 a', '<', 'a 0 b'],
      ['a 0 a', '<', 'a 00 b'],
      ['a0a', '<', 'a0b'],
      ['a0a', '<', 'a00b'],
    ].forEach(verify);
  });

  it('should compare integer substrings with leading 0s by their numeric value', function() {
    [
      ['000', '=', '000'],
      ['001', '=', '001'],
      ['00', '<', '1'],
      ['00', '<', '0001'],
      ['010', '>', '01'],
      ['010', '>', '001'],
    ].forEach(verify);
  });

  it('should not consider a decimal point surrounded by integers as a floating point number', function() {
    [
      ['0.01', '<', '0.001'],
      ['0.001', '>', '0.01'],
      ['1.01', '<', '1.001'],
      ['1.001', '>', '1.01'],
    ].forEach(verify);
  });

  it('should not consider an integer preceeded by a minus sign as a negative number', function() {
    [
      ['-1', '<', '-2'],
      ['-2', '<', '-10'],
      ['-11', '>', '-10'],
      ['-11', '<', '-100'],
      ['a-11', '<', 'a-100'],
    ].forEach(verify);
  });

  it('should compare non-string inputs as strings', function() {
    [
      [1, '<', 2],
      [2, '>', 1],
      [20, '>', 3],
      [true, '>', false],
      [null, '<', undefined],
      [{}, '=', {}],
      [
        {toString: function() { return 'a'; }},
        '<',
        {toString: function() { return 'b'; }},
      ],
    ].forEach(verify);
  });

  it('should correctly compare strings containing very large numbers', function() {
    [
      [
        '1165874568735487968325787328996864',
        '=',
        '1165874568735487968325787328996864',
      ],
      [
        '1165874568735487968325787328996864',
        '<',
        '1165874568735487968325787328996865',
      ],
      [
        '1165874568735487968325787328996864',
        '>',
        '216587456873548796832578732899686',
      ],
    ].forEach(verify);
  });
});

describe('naturalCompare()', function() {
  it('should perform case-sensitive comparisons', function() {
    naturalCompare('a', 'A').should.be.greaterThan(0);
    naturalCompare('b', 'C').should.be.greaterThan(0);
  });

  it('should function correctly as the callback to array.sort()', function() {
    ['a', 'c', 'b', 'd']
      .sort(naturalCompare)
      .should.deepEqual(['a', 'b', 'c', 'd']);

    ['file-2.txt', 'file-1.txt', 'file-20.txt', 'file-3.txt']
      .sort(naturalCompare)
      .should.deepEqual(['file-1.txt', 'file-2.txt', 'file-3.txt', 'file-20.txt']);

    [
      'a000',
      'a000.html',
      'a000a.html',
      'a000b.html',
      'a0',
      'a00',
      'a00.html',
      'a00a.html',
      'a0001a.html',
      'a001a.html',
      'a1a.html',
    ].sort(naturalCompare).should.deepEqual([
      'a0',
      'a00',
      'a000',
      'a00.html',
      'a000.html',
      'a00a.html',
      'a000a.html',
      'a000b.html',
      'a1a.html',
      'a001a.html',
      'a0001a.html',
    ]);
  });

  it('should compare strings using the provided alphabet', function() {
    naturalCompare.alphabet = 'ABDEFGHIJKLMNOPRSŠZŽTUVÕÄÖÜXYabdefghijklmnoprsšzžtuvõäöüxy';

    ['Д', 'a', 'ä', 'B', 'Š', 'X', 'A', 'õ', 'u', 'z', '1', '2', '9', '10']
      .sort(naturalCompare)
      .should.deepEqual(['1', '2', '9', '10', 'A', 'B', 'Š', 'X', 'a', 'z', 'u', 'õ', 'ä', 'Д']);

    naturalCompare.alphabet = ''; // Don't mess up other tests
  });
});

describe('naturalCompare.caseInsensitive()', function() {
  it('should perform case-insensitive comparisons', function() {
    naturalCompare.caseInsensitive('a', 'A').should.equal(0);
    naturalCompare.caseInsensitive('b', 'C').should.be.lessThan(0);
  });

  it('should function correctly as the callback to array.sort()', function() {
    ['C', 'B', 'a', 'd']
      .sort(naturalCompare.caseInsensitive)
      .should.deepEqual(['a', 'B', 'C', 'd']);
  });

  it('should compare strings using the provided alphabet', function() {
    naturalCompare.alphabet = 'ABDEFGHIJKLMNOPRSŠZŽTUVÕÄÖÜXYabdefghijklmnoprsšzžtuvõäöüxy';

    ['Д', 'a', 'ä', 'B', 'Š', 'X', 'Ü', 'õ', 'u', 'z', '1', '2', '9', '10']
      .sort(naturalCompare.caseInsensitive)
      .should.deepEqual(['1', '2', '9', '10', 'a', 'B', 'Š', 'z', 'u', 'õ', 'ä', 'Ü', 'X', 'Д']);
  });
});

describe('naturalCompare.i', function() {
  it('is an alias for naturalCompare.caseInsensitive', function() {
    naturalCompare.i.should.equal(naturalCompare.caseInsensitive);
  });
});

describe('naturalCompare.alphabet', function() {
  it('can be set and retrieved', function() {
    naturalCompare.alphabet = 'cba';
    naturalCompare.alphabet.should.equal('cba');
  });

  it('can be set to null', function() {
    naturalCompare.alphabet = null;
  });
});
