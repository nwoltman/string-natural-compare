'use strict';

require('should');

const assert = require('assert').strict;
const naturalCompare = require('../');

function verify(testData) {
  const a = testData[0];
  const b = testData[2];
  const failMessage = `failure on input: [${testData.join(' ')}]`;

  switch (testData[1]) {
    case '=':
      naturalCompare(a, b).should.equal(0, failMessage);
      naturalCompare(a, b, {caseInsensitive: true}).should.equal(0, failMessage);
      break;
    case '>':
      naturalCompare(a, b).should.be.greaterThan(0, failMessage);
      naturalCompare(a, b, {caseInsensitive: true}).should.be.greaterThan(0, failMessage);
      break;
    case '<':
      naturalCompare(a, b).should.be.lessThan(0, failMessage);
      naturalCompare(a, b, {caseInsensitive: true}).should.be.lessThan(0, failMessage);
      break;
    default:
      throw new Error('Unknown comparison operator: ' + testData[1]);
  }
}

describe('naturalCompare()', () => {

  it('should throw if the first argument is not a string', () => {
    assert.throws(
      () => naturalCompare(undefined),
      new TypeError("The first argument must be a string. Received type 'undefined'")
    );
    assert.throws(
      () => naturalCompare(null),
      new TypeError("The first argument must be a string. Received type 'object'")
    );
    assert.throws(
      () => naturalCompare(1),
      new TypeError("The first argument must be a string. Received type 'number'")
    );
    assert.throws(
      () => naturalCompare(false),
      new TypeError("The first argument must be a string. Received type 'boolean'")
    );
    assert.throws(
      () => naturalCompare({}),
      new TypeError("The first argument must be a string. Received type 'object'")
    );
    assert.throws(
      () => naturalCompare([]),
      new TypeError("The first argument must be a string. Received type 'object'")
    );
    assert.throws(
      () => naturalCompare(Symbol('sym')),
      new TypeError("The first argument must be a string. Received type 'symbol'")
    );
  });

  it('should throw if the second argument is not a string', () => {
    assert.throws(
      () => naturalCompare('', undefined),
      new TypeError("The second argument must be a string. Received type 'undefined'")
    );
    assert.throws(
      () => naturalCompare('', null),
      new TypeError("The second argument must be a string. Received type 'object'")
    );
    assert.throws(
      () => naturalCompare('', 0),
      new TypeError("The second argument must be a string. Received type 'number'")
    );
    assert.throws(
      () => naturalCompare('', true),
      new TypeError("The second argument must be a string. Received type 'boolean'")
    );
    assert.throws(
      () => naturalCompare('', {}),
      new TypeError("The second argument must be a string. Received type 'object'")
    );
    assert.throws(
      () => naturalCompare('', []),
      new TypeError("The second argument must be a string. Received type 'object'")
    );
    assert.throws(
      () => naturalCompare('', Symbol('sym')),
      new TypeError("The second argument must be a string. Received type 'symbol'")
    );
  });

  it('should compare strings that do not contain numbers', () => {
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

  it('should compare integer substrings by their numeric value', () => {
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

  it('should work with 0 in the string', () => {
    [
      ['a00', '<', 'a000'],
      ['a 0 a', '<', 'a 0 b'],
      ['a 0 a', '<', 'a 00 b'],
      ['a00', '<', 'a0a'],
      ['a0000', '<', 'a0a'],
      ['a0a', '>', 'a00'],
      ['a0a', '>', 'a000'],
      ['a0a', '<', 'a0b'],
      ['a0a', '<', 'a00a'],
      ['a0a', '<', 'a00b'],
      ['a00a', '<', 'a0b'],
      ['a00a0a', '<', 'a0a00b'],
      ['a0a00b', '<', 'a00a0b'],
      ['a00a0b', '>', 'a0a00b'],
    ].forEach(verify);
  });

  it('should compare integer substrings with leading 0s by their numeric value', () => {
    [
      ['000', '=', '000'],
      ['001', '=', '001'],
      ['00', '<', '1'],
      ['00', '<', '0001'],
      ['010', '>', '01'],
      ['010', '>', '001'],
    ].forEach(verify);
  });

  it('should not consider a decimal point surrounded by integers as a floating point number', () => {
    [
      ['0.01', '<', '0.001'],
      ['0.001', '>', '0.01'],
      ['1.01', '<', '1.001'],
      ['1.001', '>', '1.01'],
    ].forEach(verify);
  });

  it('should not consider an integer preceeded by a minus sign as a negative number', () => {
    [
      ['-1', '<', '-2'],
      ['-2', '<', '-10'],
      ['-11', '>', '-10'],
      ['-11', '<', '-100'],
      ['a-11', '<', 'a-100'],
    ].forEach(verify);
  });

  it('should correctly compare strings containing very large numbers', () => {
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

  it('should perform case-sensitive comparisons by default', () => {
    naturalCompare('a', 'A').should.be.greaterThan(0);
    naturalCompare('b', 'C').should.be.greaterThan(0);
  });

  it('should function correctly as the callback to array.sort()', () => {
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
      'a000000000',
    ].sort(naturalCompare).should.deepEqual([
      'a0',
      'a00',
      'a000',
      'a000000000',
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

  it('should compare strings using the provided alphabet', () => {
    const opts = {
      alphabet: 'ABDEFGHIJKLMNOPRSŠZŽTUVÕÄÖÜXYabdefghijklmnoprsšzžtuvõäöüxy',
    };

    ['Д', 'a', 'ä', 'B', 'Š', 'X', 'A', 'õ', 'u', 'z', '1', '2', '9', '10']
      .sort((a, b) => naturalCompare(a, b, opts))
      .should.deepEqual(['1', '2', '9', '10', 'A', 'B', 'Š', 'X', 'a', 'z', 'u', 'õ', 'ä', 'Д']);

    naturalCompare.alphabet = null; // Reset alphabet for other tests
  });


  describe('with {caseInsensitive: true}', () => {

    it('should perform case-insensitive comparisons', () => {
      naturalCompare('a', 'A', {caseInsensitive: true}).should.equal(0);
      naturalCompare('b', 'C', {caseInsensitive: true}).should.be.lessThan(0);

      ['C', 'B', 'a', 'd']
        .sort((a, b) => naturalCompare(a, b, {caseInsensitive: true}))
        .should.deepEqual(['a', 'B', 'C', 'd']);
    });

    it('should compare strings using the provided alphabet', () => {
      const opts = {
        alphabet: 'ABDEFGHIJKLMNOPRSŠZŽTUVÕÄÖÜXYabdefghijklmnoprsšzžtuvõäöüxy',
        caseInsensitive: true,
      };

      ['Д', 'a', 'ä', 'B', 'Š', 'X', 'Ü', 'õ', 'u', 'z', '1', '2', '9', '10']
        .sort((a, b) => naturalCompare(a, b, opts))
        .should.deepEqual(['1', '2', '9', '10', 'a', 'B', 'Š', 'z', 'u', 'õ', 'ä', 'Ü', 'X', 'Д']);
    });

  });

});
