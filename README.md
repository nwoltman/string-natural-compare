# Natural Compare

Compare alphanumeric strings the same way a human would, using a natural order algorithm

[![NPM Version](https://img.shields.io/npm/v/string-natural-compare.svg)](https://www.npmjs.com/package/string-natural-compare)
[![Build Status](https://travis-ci.org/woollybogger/string-natural-compare.svg?branch=master)](https://travis-ci.org/woollybogger/string-natural-compare)
[![Coverage Status](https://coveralls.io/repos/woollybogger/string-natural-compare/badge.svg?branch=master)](https://coveralls.io/r/woollybogger/string-natural-compare?branch=master)
[![Dependency Status](https://david-dm.org/woollybogger/string-natural-compare.svg)](https://david-dm.org/woollybogger/string-natural-compare)
[![devDependency Status](https://david-dm.org/woollybogger/string-natural-compare/dev-status.svg)](https://david-dm.org/woollybogger/string-natural-compare#info=devDependencies)


## Installation

#### Node.js:

```sh
npm install string-natural-compare --save
```

Then in your JS:

```js
require('string-natural-compare');
```

#### Browser:

```html
<script src="natural-compare.min.js"></script>
``` 


## Usage

```js
// Simple case-sensitive example
var a = ['z1.doc', 'z10.doc', 'z17.doc', 'z2.doc', 'z23.doc', 'z3.doc'];
a.sort(String.naturalCompare);
// -> ['z1.doc', 'z2.doc', 'z3.doc', 'z10.doc', 'z17.doc', 'z23.doc']

// Simple case-insensitive example
var a = ['B', 'C', 'a', 'd'];
a.sort(String.naturalCaseCompare);
// -> ['a', 'B', 'C', 'd']

// In most cases we want to sort an array of objects
var a = [
  {street: '350 5th Ave', room: 'A-1021'},
  {street: '350 5th Ave', room: 'A-21046-b'}
];

// Sort by street, then by room
a.sort(function(a, b) {
  return String.naturalCompare(a.street, b.street) || String.naturalCompare(a.room, b.room);
});

// When text transformation is needed or when doing a case-insensitive sort on a
// large array, it is best for performance to pre-compute the transformed text
// and store it in that object. This way, the text transformation will not be
// needed for every comparison when sorting.
var a = [
  {make: 'Audi', model: 'A6'},
  {make: 'Kia',  model: 'Rio'}
];

// Sort by make, then by model
a = a.map(function(car) {
  car.sort_key = (car.make + ' ' + car.model).toLowerCase();
});
a.sort(function(a, b) {
  return String.naturalCompare(a.sort_key, b.sort_key);
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
['Ё', 'А', 'Б'].sort(String.naturalCompare);
// -> ['А', 'Б', 'Ё']
```

**Note:** Putting numbers in the custom alphabet can cause undefined behaviour.
