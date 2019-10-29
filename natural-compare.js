'use strict';

var alphabet;
var alphabetIndexMap = [];

function isNumberCode(code) {
  return code >= 48 && code <= 57;
}

function naturalCompare(a, b, opts) {
  if (typeof a !== 'string') {
    throw new TypeError(`The first argument must be a string. Received type '${typeof a}'`);
  }
  if (typeof b !== 'string') {
    throw new TypeError(`The second argument must be a string. Received type '${typeof b}'`);
  }

  if (opts && opts.caseInsensitive) {
    a = a.toLowerCase();
    b = b.toLowerCase();
  }

  var lengthA = a.length;
  var lengthB = b.length;
  var aIndex = 0;
  var bIndex = 0;

  while (aIndex < lengthA && bIndex < lengthB) {
    var charCodeA = a.charCodeAt(aIndex);
    var charCodeB = b.charCodeAt(bIndex);

    if (isNumberCode(charCodeA)) {
      if (!isNumberCode(charCodeB)) {
        return charCodeA - charCodeB;
      }

      var numStartA = aIndex;
      var numStartB = bIndex;

      while (charCodeA === 48 && ++numStartA < lengthA) {
        charCodeA = a.charCodeAt(numStartA);
      }
      while (charCodeB === 48 && ++numStartB < lengthB) {
        charCodeB = b.charCodeAt(numStartB);
      }

      var numEndA = numStartA;
      var numEndB = numStartB;

      while (numEndA < lengthA && isNumberCode(a.charCodeAt(numEndA))) {
        ++numEndA;
      }
      while (numEndB < lengthB && isNumberCode(b.charCodeAt(numEndB))) {
        ++numEndB;
      }

      var difference = numEndA - numStartA - numEndB + numStartB; // numA length - numB length
      if (difference) {
        return difference;
      }

      while (numStartA < numEndA) {
        difference = a.charCodeAt(numStartA++) - b.charCodeAt(numStartB++);
        if (difference) {
          return difference;
        }
      }

      aIndex = numEndA;
      bIndex = numEndB;
      continue;
    }

    if (charCodeA !== charCodeB) {
      if (
        charCodeA < alphabetIndexMap.length &&
        charCodeB < alphabetIndexMap.length &&
        alphabetIndexMap[charCodeA] !== -1 &&
        alphabetIndexMap[charCodeB] !== -1
      ) {
        return alphabetIndexMap[charCodeA] - alphabetIndexMap[charCodeB];
      }

      return charCodeA - charCodeB;
    }

    ++aIndex;
    ++bIndex;
  }

  if (aIndex >= lengthA && bIndex < lengthB && lengthA >= lengthB) {
    return -1;
  }

  if (bIndex >= lengthB && aIndex < lengthA && lengthB >= lengthA) {
    return 1;
  }

  return lengthA - lengthB;
}

Object.defineProperties(naturalCompare, {
  alphabet: {
    get() {
      return alphabet;
    },

    set(value) {
      alphabet = value;
      alphabetIndexMap = [];

      if (!alphabet) {
        return;
      }

      const maxCharCode = alphabet.split('').reduce((maxCode, char) => {
        return Math.max(maxCode, char.charCodeAt(0));
      }, 0);

      for (let i = 0; i <= maxCharCode; i++) {
        alphabetIndexMap.push(-1);
      }

      for (let i = 0; i < alphabet.length; i++) {
        alphabetIndexMap[alphabet.charCodeAt(i)] = i;
      }
    },
  },
});

module.exports = naturalCompare;
