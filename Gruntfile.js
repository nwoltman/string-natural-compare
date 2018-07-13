/* eslint-disable camelcase, global-require */

'use strict';

module.exports = function(grunt) {
  require('jit-grunt')(grunt);

  grunt.initConfig({
    eslint: {
      all: {
        src: '**/*.js',
        ignore: '@(node_modules|coverage)/**',
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
  grunt.registerTask('lint', ['eslint']);
  grunt.registerTask('test', [process.env.CI ? 'mocha_istanbul:coveralls' : 'mochaTest']);
  grunt.registerTask('coverage', ['mocha_istanbul:coverage']);
  grunt.registerTask('default', ['lint', 'test']);
};
