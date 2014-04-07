/*
 * grunt-changelog
 * https://github.com/ericmatthys/grunt-changelog
 *
 * Copyright (c) 2013 Eric Matthys
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function (grunt) {
  grunt.initConfig({
    jshint: {
      all: [
        'Gruntfile.js',
        'tasks/*.js',
        '<%= nodeunit.tests %>',
      ],
      options: {
        jshintrc: '.jshintrc',
      },
    },

    clean: {
      tests: ['tmp'],
    },

    changelog: {
      default_options: {
        options: {
          log: 'test/fixtures/log',
          dest: 'tmp/changelog_default'
        }
      },

      formatting_options: {
        options: {
          log: 'test/fixtures/log',
          dest: 'tmp/changelog_formatting',
          template: '{{> fixes}}{{> features}}\n',

          partials: {
            features: '{{#each features}}{{> feature}}{{/each}}',
            feature: '{{this}}',
            fixes: '{{#each fixes}}{{> fix}}{{/each}}',
            fix: '{{this}}'
          }
        }
      },

      regex_options: {
        options: {
          log: 'test/fixtures/log',
          dest: 'tmp/changelog_regex',
          featureRegex: /^closes #\d+:?(.*)$/gm,
          fixRegex: /^fixes #\d+:?(.*)$/gm
        }
      },

      empty_partial: {
        options: {
          log: 'test/fixtures/log_fixes_only',
          dest: 'tmp/changelog_empty'
        }
      },

      prepend_prime: {
        options: {
          log: 'test/fixtures/log',
          dest: 'tmp/changelog_prepend',
          insertType: 'prepend'
        }
      },

      prepend: {
        options: {
          log: 'test/fixtures/log_insert_type',
          dest: 'tmp/changelog_prepend',
          insertType: 'prepend'
        }
      },

      append_prime: {
        options: {
          log: 'test/fixtures/log',
          dest: 'tmp/changelog_append',
          insertType: 'append'
        }
      },

      append: {
        options: {
          log: 'test/fixtures/log_insert_type',
          dest: 'tmp/changelog_append',
          insertType: 'append'
        }
      }
    },

    nodeunit: {
      tests: ['test/*_test.js'],
    }
  });

  grunt.loadTasks('tasks');

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-nodeunit');

  grunt.registerTask('test', ['clean', 'changelog', 'nodeunit']);

  grunt.registerTask('default', ['jshint', 'test']);
};
