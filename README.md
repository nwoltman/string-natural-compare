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

```js
require('string-natural-compare');
```

#### Browser:

```html
<script src="natural-compare.min.js"></script>
``` 


## Usage

```js
// Simple case sensitive example
var a = ['z1.doc', 'z10.doc', 'z17.doc', 'z2.doc', 'z23.doc', 'z3.doc'];
a.sort(String.naturalCompare);
// -> ['z1.doc', 'z2.doc', 'z3.doc', 'z10.doc', 'z17.doc', 'z23.doc']

// Use wrapper function for case insensitivity
a.sort(function(a, b){
  return String.naturalCompare(a.toLowerCase(), b.toLowerCase());
});

// In most cases we want to sort an array of objects
var a = [
  {street: '350 5th Ave', room: 'A-1021'},
  {street: '350 5th Ave', room: 'A-21046-b'}
];

// Sort by street, then by room
a.sort(function(a, b) {
  return String.naturalCompare(a.street, b.street) || String.naturalCompare(a.room, b.room);
});

// When text transformation is needed (e.g. toLowerCase()), it is best for
// performance to keep the transformed key in that object. That way, the
// text transformation will not be needed for every comparison when sorting.
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
