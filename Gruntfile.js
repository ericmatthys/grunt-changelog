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
			default: {
				options: {
					log: 'test/fixtures/log',
					dest: 'tmp/changelog_default'
				}
			},
			formatting: {
				options: {
					log: 'test/fixtures/log',
					dest: 'tmp/changelog_formatting',
					templates: {
						main: '{{fixes}}{{features}}\n',
						change: '{{change}}',
						empty: 'none'
					}
				}
			},
			regex: {
				options: {
					log: 'test/fixtures/log',
					dest: 'tmp/changelog_regex',
					featureRegex: /^closes #\d+:?(.*)$/gm,
					fixRegex: /^fixes #\d+:?(.*)$/gm
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
