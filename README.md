# String Natural Compare

Compare alphanumeric strings the same way a human would, using a natural order algorithm

[![NPM Version](https://img.shields.io/npm/v/string-natural-compare.svg)](https://www.npmjs.com/package/string-natural-compare)
![Bower Version](https://img.shields.io/bower/v/string-natural-compare.svg)
[![Build Status](https://travis-ci.org/woollybogger/string-natural-compare.svg?branch=master)](https://travis-ci.org/woollybogger/string-natural-compare)
[![Coverage Status](https://coveralls.io/repos/woollybogger/string-natural-compare/badge.svg?branch=master)](https://coveralls.io/r/woollybogger/string-natural-compare?branch=master)
[![devDependency Status](https://david-dm.org/woollybogger/string-natural-compare/dev-status.svg)](https://david-dm.org/woollybogger/string-natural-compare#info=devDependencies)

```
Standard sorting:   Natural order sorting:
    img1.png            img1.png
    img10.png           img2.png
    img12.png           img10.png
    img2.png            img12.png
```

This module makes two functions available on the global `String` object:

+ `String.naturalCompare` (case-sensitive)
+ `String.naturalCaseCompare` (case-insensitive)

These functions return a number indicating whether one string should come before, after, or is the same as another string.
They can be easily used with the native [`.sort()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort) array method.

### Fast and Robust

This module uses a performant and robust algorithm to compare alphanumeric strings. It does not convert numeric substrings into JavaScript numbers, so it can compare strings containing very large numeric substrings (i.e. exceeding JavaScript's [`MAX_SAFE_INTEGER`](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Number/MAX_SAFE_INTEGER)). The algorithm has been optimized to be very fast, even when a [custom alphabet](#custom-alphabet) has been configured.

+ [jsPerf - natsort()](http://jsperf.com/natsort/2)
+ [jsPerf - natsort() with custom alphabet](http://jsperf.com/natsort-custom-alphabet)


## Installation

#### Node.js:

```sh
npm install string-natural-compare --save
```

Then in your JS:

```js
require('string-natural-compare');
```

#### Bower:

```sh
bower install string-natural-compare
```

Include the script in your HTML (drop the ".min" to use the development version):

```html
<script src="/bower_components/string-natural-compare/natural-compare.min.js"></script>
```

**Note:** IE8 and lower not supported.


## Usage

```js
// Simple case-sensitive sorting
var a = ['z1.doc', 'z10.doc', 'z17.doc', 'z2.doc', 'z23.doc', 'z3.doc'];
a.sort(String.naturalCompare);
// -> ['z1.doc', 'z2.doc', 'z3.doc', 'z10.doc', 'z17.doc', 'z23.doc']


// Simple case-insensitive sorting
var a = ['B', 'C', 'a', 'd'];
a.sort(String.naturalCaseCompare);
// -> ['a', 'B', 'C', 'd']


// Compare strings containing large numbers
String.naturalCompare(
  '1165874568735487968325787328996865',
  '265812277985321589735871687040841'
);
// -> 1


// In most cases we want to sort an array of objects
var a = [
  {street: '350 5th Ave', room: 'A-1021'},
  {street: '350 5th Ave', room: 'A-21046-b'}
];

// Sort by street (case-insensitive), then by room (case-sensitive)
a.sort(function(a, b) {
  return (
    String.naturalCompare(a.street.toLowerCase(), b.street.toLowerCase()) ||
    String.naturalCompare(a.room, b.room)
  );
});


// When text transformation is needed or when doing a case-insensitive sort on a
// large array, it is best for performance to pre-compute the transformed text
// and store it in that object. This way, the text transformation will not be
// needed for every comparison when sorting.
var a = [
  {make: 'Audi', model: 'R8'},
  {make: 'Porsche', model: '911 Turbo S'}
];

// Sort by make, then by model
a.forEach(function(car) {
  car.sortKey = (car.make + ' ' + car.model).toLowerCase();
});
a.sort(function(a, b) {
  return String.naturalCompare(a.sortKey, b.sortKey);
});
```

### Custom Alphabet

It is possible to configure a custom alphabet to achieve a desired character ordering.

```js
// Estonian alphabet
String.alphabet = 'ABDEFGHIJKLMNOPRSŠZŽTUVÕÄÖÜXYabdefghijklmnoprsšzžtuvõäöüxy';
['t', 'z', 'x', 'õ'].sort(String.naturalCompare);
// -> ['z', 't', 'õ', 'x']

// Russian alphabet
String.alphabet = 'АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯабвгдеёжзийклмнопрстуфхцчшщъыьэюя';
['Ё', 'А', 'б', 'Б'].sort(String.naturalCompare);
// -> ['А', 'Б', 'Ё', 'б']
```

**Note:** Putting numbers in the custom alphabet can cause undefined behaviour.
