// jscs:disable requireTrailingComma

module.exports = function(grunt) {
  'use strict';

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    jsonlint: {
      all: {
        src: ['*.json', '.jshintrc']
      }
    },

    jshint: {
      all: {
        src: ['*.js', 'test/*.js'],
        options: {
          jshintrc: true,
          ignores: ['*.min*']
        }
      }
    },

    jscs: {
      all: ['Gruntfile.js', 'natural-compare.js', 'test/*.js'],
      options: {
        config: '.jscsrc'
      }
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
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-jscs');
  grunt.loadNpmTasks('grunt-mocha-cov');
  grunt.loadNpmTasks('grunt-contrib-uglify');

  // Register tasks
  grunt.registerTask('lint', ['jsonlint', 'jshint', 'jscs']);
  grunt.registerTask('test', ['mochacov:test'].concat(process.env.CI ? ['mochacov:testAndCoverage'] : []));
  grunt.registerTask('coverage', ['mochacov:coverage']);
  grunt.registerTask('build', ['uglify']);
  grunt.registerTask('default', ['lint', 'test', 'build']);
};
