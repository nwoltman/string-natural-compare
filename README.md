# node-natural-compare

A fast natural string comparison algorithm for Node

[![NPM Version](https://img.shields.io/npm/v/node-natural-compare.svg)](https://www.npmjs.com/package/node-natural-compare)
[![Build Status](https://travis-ci.org/woollybogger/node-natural-compare.svg?branch=master)](https://travis-ci.org/woollybogger/node-natural-compare)
[![Coverage Status](https://coveralls.io/repos/woollybogger/node-natural-compare/badge.svg?branch=master)](https://coveralls.io/r/woollybogger/node-natural-compare?branch=master)
[![Dependency Status](https://david-dm.org/woollybogger/node-natural-compare.svg)](https://david-dm.org/woollybogger/node-natural-compare)
[![devDependency Status](https://david-dm.org/woollybogger/node-natural-compare/dev-status.svg)](https://david-dm.org/woollybogger/node-natural-compare#info=devDependencies)


## Installation

```sh
npm install node-natural-compare --save
```

## Usage

```js
var naturalCompare = require('node-natural-compare');

// Simple case sensitive example
var a = ['z1.doc', 'z10.doc', 'z17.doc', 'z2.doc', 'z23.doc', 'z3.doc'];
a.sort(naturalCompare);
// -> ['z1.doc', 'z2.doc', 'z3.doc', 'z10.doc', 'z17.doc', 'z23.doc']

// Use wrapper function for case insensitivity
a.sort(function(a, b){
  return naturalCompare(a.toLowerCase(), b.toLowerCase());
});

// In most cases we want to sort an array of objects
var a = [
  {street: '350 5th Ave', room: 'A-1021'},
  {street: '350 5th Ave', room: 'A-21046-b'}
];

// Sort by street, then by room
a.sort(function(a, b) {
  return naturalCompare(a.street, b.street) || naturalCompare(a.room, b.room);
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
  return naturalCompare(a.sort_key, b.sort_key);
});
```

Requires [browserify](https://www.npmjs.com/package/browserify) to work in the browser.
