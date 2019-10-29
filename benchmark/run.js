/* eslint-disable no-console */
'use strict';

const Benchmark = require('benchmark');

const naturalCompareMaster = require('string-natural-compare');
const naturalCompareLocal = require('../');

const config = new Set(
  process.argv.length > 2 ? process.argv[2].split(',') : '1234567'
);

const suite = new Benchmark.Suite();

if (config.has('1')) {
  suite
    .add('1) no numbers master', () => {
      naturalCompareMaster('fileA.txt', 'fileB.txt');
      naturalCompareMaster('fileB.txt', 'fileA.txt');
    })
    .add('1) no numbers local', () => {
      naturalCompareLocal('fileA.txt', 'fileB.txt');
      naturalCompareLocal('fileB.txt', 'fileA.txt');
    });
}

if (config.has('2')) {
  suite
    .add('2) common numbers different lengths master', () => {
      naturalCompareMaster('2.txt', '10.txt');
      naturalCompareMaster('10.txt', '2.txt');
    })
    .add('2) common numbers different lengths local', () => {
      naturalCompareLocal('2.txt', '10.txt');
      naturalCompareLocal('10.txt', '2.txt');
    });
}

if (config.has('3')) {
  suite
    .add('3) common numbers same length master', () => {
      naturalCompareMaster('01.txt', '05.txt');
      naturalCompareMaster('05.txt', '01.txt');
    })
    .add('3) common numbers same length local', () => {
      naturalCompareLocal('01.txt', '05.txt');
      naturalCompareLocal('05.txt', '01.txt');
    });
}

if (config.has('4')) {
  suite
    .add('4) big numbers different lengths master', () => {
      naturalCompareMaster(
        '1165874568735487968325787328996865',
        '265812277985321589735871687040841'
      );
      naturalCompareMaster(
        '265812277985321589735871687040841',
        '1165874568735487968325787328996865'
      );
    })
    .add('4) big numbers different lengths local', () => {
      naturalCompareLocal(
        '1165874568735487968325787328996865',
        '265812277985321589735871687040841'
      );
      naturalCompareLocal(
        '265812277985321589735871687040841',
        '1165874568735487968325787328996865'
      );
    });
}

if (config.has('5')) {
  suite
    .add('5) big numbers same length master', () => {
      naturalCompareMaster(
        '1165874568735487968325787328996865',
        '1165874568735487989735871687040841'
      );
      naturalCompareMaster(
        '1165874568735487989735871687040841',
        '1165874568735487968325787328996865'
      );
    })
    .add('5) big numbers same length local', () => {
      naturalCompareLocal(
        '1165874568735487968325787328996865',
        '1165874568735487989735871687040841'
      );
      naturalCompareLocal(
        '1165874568735487989735871687040841',
        '1165874568735487968325787328996865'
      );
    });
}

if (suite.length) {
  suite
    .on('cycle', (event) => {
      console.log(String(event.target));
    })
    .run();
}

const alphabetSuite = new Benchmark.Suite();
const opts = {
  alphabet: 'ABDEFGHIJKLMNOPRSŠZŽTUVÕÄÖÜXYabdefghijklmnoprsšzžtuvõäöüxy',
};

if (config.has('6')) {
  alphabetSuite
    .add('6) custom alphabet included characters master', () => {
      naturalCompareMaster('š.txt', 'z.txt', opts);
      naturalCompareMaster('z.txt', 'š.txt', opts);
    })
    .add('6) custom alphabet included characters local', () => {
      naturalCompareLocal('š.txt', 'z.txt', opts);
      naturalCompareLocal('z.txt', 'š.txt', opts);
    });
}

if (config.has('7')) {
  alphabetSuite
    .add('7) custom alphabet missing characters master', () => {
      naturalCompareMaster('é.txt', 'à.txt', opts);
      naturalCompareMaster('à.txt', 'é.txt', opts);
    })
    .add('7) custom alphabet missing characters local', () => {
      naturalCompareLocal('é.txt', 'à.txt', opts);
      naturalCompareLocal('à.txt', 'é.txt', opts);
    });
}

if (alphabetSuite.length) {
  alphabetSuite
    .on('cycle', (event) => {
      console.log(String(event.target));
    })
    .run();
}
