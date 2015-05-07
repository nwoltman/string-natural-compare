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
          jshintrc: true
        }
      }
    },

    jscs: {
      all: ['*.js', 'test/*.js'],
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
    }
  });

  // Load the Grunt plugins
  grunt.loadNpmTasks('grunt-jsonlint');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-jscs');
  grunt.loadNpmTasks('grunt-mocha-cov');

  // Register tasks
  grunt.registerTask('lint', ['jsonlint', 'jshint', 'jscs']);
  grunt.registerTask('test', ['mochacov:test'].concat(process.env.CI ? ['mochacov:testAndCoverage'] : []));
  grunt.registerTask('coverage', ['mochacov:coverage']);
  grunt.registerTask('default', ['lint', 'test']);

  grunt.registerTask('changelog', 'Add the changes since the last release to the changelog', function() {
    var done = this.async();

    var pkg = grunt.config.data.pkg;
    var repoUrl = pkg.repository.url;
    var command =
      'git --no-pager log v' + pkg.version + '... --pretty=format:"+ %s ([view](' + repoUrl + '/commit/%H))"';

    require('child_process').exec(command, function(error, stdout) {
      if (error) {
        grunt.log.error('There was an error reading the git log output.');
        grunt.fail.fatal(error);
      }

      var fs = require('fs');
      var code = fs.readFileSync('natural-compare.js', {encoding: 'utf8'});
      var curVersion = /@version (\d+\.\d+\.\d+)/.exec(code)[1];
      var date = new Date().toISOString().slice(0, 10);
      var versionHeader = '## ' + curVersion + ' (' + date + ')\n';
      var changelog = fs.readFileSync('CHANGELOG.md', {encoding: 'utf8'});

      if (changelog.indexOf(versionHeader, 13) >= 0) {
        grunt.log.error('Changelog already updated.');
        return done();
      }

      // Filter out messages that don't need to be in the changelog
      var changes = stdout.replace(/^\+ (?:Update|Merge).*[\r\n]*/gm, '');

      changelog = '# CHANGELOG\n\n' +
                  versionHeader + changes + '\n' +
                  changelog.replace(/^# CHANGELOG\s+/, '\n'); // Remove the current header

      fs.writeFile('CHANGELOG.md', changelog, done);
      grunt.log.ok('Added changes to the changelog.');
    });
  });
};
