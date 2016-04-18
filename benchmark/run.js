/* eslint-disable no-console */

'use strict';

var Benchmark = require('benchmark');

var naturalCompareMaster = require('string-natural-compare');
var naturalCompareLocal = require('../');


new Benchmark.Suite()

  .add('no numbers master', function() {
    naturalCompareMaster('fileA.txt', 'fileB.txt');
    naturalCompareMaster('fileB.txt', 'fileA.txt');
  })
  .add('no numbers local', function() {
    naturalCompareLocal('fileA.txt', 'fileB.txt');
    naturalCompareLocal('fileB.txt', 'fileA.txt');
  })

  .add('common numbers different lengths master', function() {
    naturalCompareMaster('2.txt', '10.txt');
    naturalCompareMaster('10.txt', '2.txt');
  })
  .add('common numbers different lengths local', function() {
    naturalCompareLocal('2.txt', '10.txt');
    naturalCompareLocal('10.txt', '2.txt');
  })

  .add('common numbers same length master', function() {
    naturalCompareMaster('01.txt', '05.txt');
    naturalCompareMaster('05.txt', '01.txt');
  })
  .add('common numbers same length local', function() {
    naturalCompareLocal('01.txt', '05.txt');
    naturalCompareLocal('05.txt', '01.txt');
  })

  .add('big numbers different lengths master', function() {
    naturalCompareMaster('1165874568735487968325787328996865', '265812277985321589735871687040841');
    naturalCompareMaster('265812277985321589735871687040841', '1165874568735487968325787328996865');
  })
  .add('big numbers different lengths local', function() {
    naturalCompareLocal('1165874568735487968325787328996865', '265812277985321589735871687040841');
    naturalCompareLocal('265812277985321589735871687040841', '1165874568735487968325787328996865');
  })

  .add('big numbers same length master', function() {
    naturalCompareMaster('1165874568735487968325787328996865', '1165874568735487989735871687040841');
    naturalCompareMaster('1165874568735487989735871687040841', '1165874568735487968325787328996865');
  })
  .add('big numbers same length local', function() {
    naturalCompareLocal('1165874568735487968325787328996865', '1165874568735487989735871687040841');
    naturalCompareLocal('1165874568735487989735871687040841', '1165874568735487968325787328996865');
  })

  .on('cycle', function(event) {
    console.log(String(event.target));
  })
  .run();


naturalCompareMaster.alphabet = 'ABDEFGHIJKLMNOPRSŠZŽTUVÕÄÖÜXYabdefghijklmnoprsšzžtuvõäöüxy';
naturalCompareLocal.alphabet = 'ABDEFGHIJKLMNOPRSŠZŽTUVÕÄÖÜXYabdefghijklmnoprsšzžtuvõäöüxy';

new Benchmark.Suite()

  .add('custom alphabet included characters master', function() {
    naturalCompareMaster('š.txt', 'z.txt');
    naturalCompareMaster('z.txt', 'š.txt');
  })
  .add('custom alphabet included characters local', function() {
    naturalCompareLocal('š.txt', 'z.txt');
    naturalCompareLocal('z.txt', 'š.txt');
  })

  .add('custom alphabet missing characters master', function() {
    naturalCompareMaster('é.txt', 'à.txt');
    naturalCompareMaster('à.txt', 'é.txt');
  })
  .add('custom alphabet missing characters local', function() {
    naturalCompareLocal('é.txt', 'à.txt');
    naturalCompareLocal('à.txt', 'é.txt');
  })

  .on('cycle', function(event) {
    console.log(String(event.target));
  })
  .run();
