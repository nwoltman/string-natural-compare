/**
 * Natural Compare
 * https://github.com/woollybogger/string-natural-compare
 *
 * @version 0.1.0
 * @copyright 2015 Nathan Woltman
 * @license MIT https://github.com/woollybogger/string-natural-compare/blob/master/LICENSE.txt
 */

(function() {
  'use strict';

  var alphabet;
  var alphabetIndexMap;

  function isNumber(c) {
    return c >= '0' && c <= '9';
  }

  function naturalCompare(a, b) {
    var lengthA = (a += '').length;
    var lengthB = (b += '').length;
    var i = 0;
    var j = 0;
    var alphabetIndexA;
    var alphabetIndexB;

    while (i < lengthA && j < lengthB) {
      var charA = a[i];
      var charB = b[j];

      if (isNumber(charA)) {
        if (!isNumber(charB)) {
          return charA < charB ? -1 : 1;
        }

        var numStartA = i;
        var numStartB = j;

        while (a[numStartA] === '0') {
          ++numStartA;
          if (numStartA === lengthA)
            break;
        }
        while (b[numStartB] === '0') {
          ++numStartB;
          if (numStartB === lengthB)
            break;
        }

        var numEndA = numStartA;
        var numEndB = numStartB;

        while (numEndA < lengthA && isNumber(a[numEndA])) {
          ++numEndA;
        }
        while (numEndB < lengthB && isNumber(b[numEndB])) {
          ++numEndB;
        }

        var numA = a.slice(numStartA, numEndA);
        var numB = b.slice(numStartB, numEndB);

        if (numA.length < numB.length) {
          return -1;
        }
        if (numA.length > numB.length) {
          return 1;
        }
        if (numA < numB) {
          return -1;
        }
        if (numA > numB) {
          return 1;
        }

        i = numEndA;
        j = numEndB;
        continue;
      }

      if (
        alphabet &&
        (alphabetIndexA = alphabetIndexMap[charA]) !== undefined &&
        (alphabetIndexB = alphabetIndexMap[charB]) !== undefined
      ) {
        if ((alphabetIndexA -= alphabetIndexB)) {
          return alphabetIndexA;
        }
      } else if (charA < charB) {
        return -1;
      } else if (charA > charB) {
        return 1;
      }

      ++i;
      ++j;
    }

    return lengthA - lengthB;
  }

  Object.defineProperties(String, {
    alphabet: {
      get: function() {
        return alphabet;
      },
      set: function(value) {
        alphabet = value;
        alphabetIndexMap = {};
        if (!alphabet) return;
        for (var i = 0; i < alphabet.length; i++) {
          alphabetIndexMap[alphabet[i]] = i;
        }
      }
    },
    naturalCompare: {
      value: naturalCompare,
      configurable: true,
      writable: true
    }
  });

})();
