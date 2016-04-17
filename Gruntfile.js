/* eslint-disable camelcase, global-require */

'use strict';

module.exports = function(grunt) {
  require('jit-grunt')(grunt);

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    jsonlint: {
      all: ['*.json'],
    },

    eslint: {
      all: {
        src: ['*.js', 'test/*.js'],
        ignore: '*.min.js',
      },
    },

    mochaTest: {
      test: {
        src: 'test/*.js',
      },
      options: {
        colors: true,
      },
    },

    mocha_istanbul: {
      coverage: {
        src: 'test/*.js',
        options: {
          reportFormats: ['html'],
        },
      },
      coveralls: {
        src: 'test/*.js',
        options: {
          coverage: true,
          reportFormats: ['lcovonly'],
        },
      },
      options: {
        mochaOptions: ['--colors'],
      },
    },
  });

  grunt.event.on('coverage', function(lcov, done) {
    require('coveralls').handleInput(lcov, done);
  });

  // Register tasks
  grunt.registerTask('lint', ['jsonlint', 'eslint']);
  grunt.registerTask('test', [process.env.CI ? 'mocha_istanbul:coveralls' : 'mochaTest']);
  grunt.registerTask('coverage', ['mocha_istanbul:coverage']);
  grunt.registerTask('default', ['lint', 'test']);
};
