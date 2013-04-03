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

	grunt.registerMultiTask('changelog', 'Generate a changelog based on commit messages.', function () {
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

		if (!options.after)
			options.after = moment().subtract('days', 7).format();

		if (!options.before)
			options.before = moment().format();

		grunt.verbose.writeflags(options, 'Options');

		// Loop through each match and build the string of changes that will
		// replace part of the main template.
		function getChanges(log, regex) {
			var changes = '';
			var match;

			while ((match = regex.exec(log))) {
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

		// Generate the changelog using the templates defined in options.
		function getChangelog(log) {
			var output = options.templates.main;

			output = output.replace('{{features}}', getChanges(log, options.featureRegex));
			output = output.replace('{{fixes}}', getChanges(log, options.fixRegex));

			return output;
		}

		// Write the changelog to the destination file.
		function writeChangelog(changelog) {
			grunt.file.write(options.dest, changelog);

			// Log the results.
			grunt.log.ok(changelog);
			grunt.log.writeln();
			grunt.log.writeln('Changelog created at '+ options.dest.toString().cyan + '.');
		}

		// If a log is passed in as an option, don't run the git log command
		// and just use the explicit log instead.
		if (options.log) {
			// Check to make sure that the log exists before going any further.
			if (!grunt.file.exists(options.log)) {
				grunt.fatal('This log file does not exist.');
				return false;
			}

			var result = grunt.file.read(options.log);
			var changelog = getChangelog(result);

			writeChangelog(changelog);

			return;
		}

		var done = this.async();

		// Build our options for the git log command. Only print the commit message.
		var args = [
			'log',
			'--pretty=format:%s',
			'--no-merges',
			'--after="' + options.after + '"',
			'--before="' + options.before + '"'
		];

		grunt.verbose.writeln('git ' + args.join(' '));

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

				var changelog = getChangelog(result);

				writeChangelog(changelog);

				done();
			}
		);
	});

};
