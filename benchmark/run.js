/* eslint-disable no-console */

'use strict';

var Benchmark = require('benchmark');

var naturalCompareMaster = require('string-natural-compare');
var naturalCompareCurrent = require('../');


new Benchmark.Suite()

  .add('no numbers master', function() {
    naturalCompareMaster('file.txt', 'otherFile.txt');
    naturalCompareMaster('otherFile.txt', 'file.txt');
  })
  .add('no numbers current', function() {
    naturalCompareCurrent('file.txt', 'otherFile.txt');
    naturalCompareCurrent('otherFile.txt', 'file.txt');
  })

  .add('common numbers master', function() {
    naturalCompareMaster('a2.txt', 'a10.txt');
    naturalCompareMaster('a10.txt', 'a2.txt');
  })
  .add('common numbers current', function() {
    naturalCompareCurrent('a2.txt', 'a10.txt');
    naturalCompareCurrent('a10.txt', 'a2.txt');
  })

  .add('big numbers master', function() {
    naturalCompareMaster('1165874568735487968325787328996865', '265812277985321589735871687040841');
    naturalCompareMaster('265812277985321589735871687040841', '1165874568735487968325787328996865');
  })
  .add('big numbers current', function() {
    naturalCompareCurrent('1165874568735487968325787328996865', '265812277985321589735871687040841');
    naturalCompareCurrent('265812277985321589735871687040841', '1165874568735487968325787328996865');
  })

  .on('cycle', function(event) {
    console.log(String(event.target));
  })
  .run();


naturalCompareMaster.alphabet = 'ABDEFGHIJKLMNOPRSŠZŽTUVÕÄÖÜXYabdefghijklmnoprsšzžtuvõäöüxy';
naturalCompareCurrent.alphabet = 'ABDEFGHIJKLMNOPRSŠZŽTUVÕÄÖÜXYabdefghijklmnoprsšzžtuvõäöüxy';

new Benchmark.Suite()

  .add('custom alphabet included characters master', function() {
    naturalCompareMaster('š.txt', 'z.txt');
    naturalCompareMaster('z.txt', 'š.txt');
  })
  .add('custom alphabet included characters current', function() {
    naturalCompareCurrent('š.txt', 'z.txt');
    naturalCompareCurrent('z.txt', 'š.txt');
  })

  .add('custom alphabet missing characters master', function() {
    naturalCompareMaster('é.txt', 'à.txt');
    naturalCompareMaster('à.txt', 'é.txt');
  })
  .add('custom alphabet missing characters current', function() {
    naturalCompareCurrent('é.txt', 'à.txt');
    naturalCompareCurrent('à.txt', 'é.txt');
  })

  .on('cycle', function(event) {
    console.log(String(event.target));
  })
  .run();
