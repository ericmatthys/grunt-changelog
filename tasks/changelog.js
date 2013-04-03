/*
* grunt-changelog
* https://github.com/ericmatthys/grunt-changelog
*
* Copyright (c) 2013 Eric Matthys
* Licensed under the MIT license.
*/

'use strict';

module.exports = function (grunt) {

	var moment = require('moment');

	grunt.registerMultiTask('changelog', 'Creates a list of changes based on a git log.', function () {
		// Merge task-specific and/or target-specific options with these defaults.
		var options = this.options({
			after: moment().subtract('days', 7).format(),
			before: moment().format(),
			featureRegex: /^(.*)closes #\d+:?(.*)$/gim,
			fixRegex: /^(.*)fixes #\d+:?(.*)$/gim,
			dest: 'changelog.txt',
			templates: {
				main: 'NEW:\n\n{{features}}\nFIXES:\n\n{{fixes}}',
				change: '  - {{change}}\n',
				empty: '  (none)\n'
			}
		});

		grunt.verbose.writeflags(options, 'Options');

		var done = this.async();

		// Build our options for the git log command. Only print the commit message.
		var args = ['log', '--pretty=format:%s', '--no-merges'];
		args.push('--after="' + options.after + '"');
		args.push('--before="' + options.before + '"');

		grunt.verbose.writeln('git ' + args.join(' ') + '\n' );

		// Run the git log command and parse the result.
		grunt.util.spawn(
			{
				cmd: 'git',
				args: args
			},

			function (error, result) {
				if (error) {
					grunt.log.error(error);
					return done(false);
				}

				var output = options.templates.main;

				function getChanges(regex) {
					var changes = '';
					var match;

					// Loop through each match and build the string that will
					// replace part of the  main template.
					while ((match = regex.exec(result))) {
						var change = '';

						for (var i = 1, len = match.length; i < len; i++) {
							change += match[i];
						}

						changes += options.templates.change.replace('{{change}}', change.trim());
					}

					if (changes)
						return changes;
					else
						return options.templates.empty;
				}

				output = output.replace('{{features}}', getChanges(options.featureRegex));
				output = output.replace('{{fixes}}', getChanges(options.fixRegex));

				// Write the output to the destination file.
				grunt.file.write(options.dest, output);

				// Log the results.
				grunt.log.ok(output);
				grunt.log.writeln();
				grunt.log.ok('Changelog created at '+ options.dest + '.');

				done();
			}
		);
	});

};
