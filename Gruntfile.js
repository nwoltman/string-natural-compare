/* eslint-disable comma-dangle */

'use strict';

module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    jsonlint: {
      all: ['*.json'],
    },

    eslint: {
      all: ['*.js', '!natural-compare.min.js', 'test/*.js'],
    },

    mochacov: {
      test: {
        options: {
          reporter: 'spec'
        }
      },
      coverage: {
        options: {
          reporter: 'html-cov',
          quiet: true,
          output: 'coverage/coverage.html'
        }
      },
      testAndCoverage: {
        options: {
          coveralls: true
        }
      },
      options: {
        files: 'test/*.js'
      }
    },

    uglify: {
      options: {
        banner: '/*! Natural Compare v<%= pkg.version %> | (c) 2015 Nathan Woltman | <%= pkg.repository.url %> */\n',
        screwIE8: true
      },
      build: {
        src: 'natural-compare.js',
        dest: 'natural-compare.min.js'
      }
    }
  });

  // Load the Grunt plugins
  grunt.loadNpmTasks('grunt-jsonlint');
  grunt.loadNpmTasks('grunt-eslint');
  grunt.loadNpmTasks('grunt-mocha-cov');
  grunt.loadNpmTasks('grunt-contrib-uglify');

  // Register tasks
  grunt.registerTask('lint', ['jsonlint', 'eslint']);
  grunt.registerTask('test', ['mochacov:test'].concat(process.env.CI ? ['mochacov:testAndCoverage'] : []));
  grunt.registerTask('coverage', ['mochacov:coverage']);
  grunt.registerTask('build', ['uglify']);
  grunt.registerTask('default', ['lint', 'test', 'build']);
};
