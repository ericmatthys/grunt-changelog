/*
* grunt-changelog
* https://github.com/ericmatthys/grunt-changelog
*
* Copyright (c) 2013 Eric Matthys
* Licensed under the MIT license.
*/

'use strict';




function configureSections(options, sections, _) {

  sections.regex = {};
  if (options.featureRegex) {
    _.extend(sections.regex, {features: options.featureRegex});
  }

  if (options.fixRegex) {
    _.extend(sections.regex, {fixes: options.fixRegex});
  }

  if (options.sections) {
    _.extend(sections.regex, options.sections);
  }

  // Extend partials separately so only one custom partial can be specified
  // without having to provide every single partial.
  sections.partials = _.extend({
    features: 'NEW:\n\n{{#if features}}{{#each features}}{{> feature}}{{/each}}{{else}}{{> empty}}{{/if}}\n',
    feature: '  - {{{this}}}\n',
    fixes: 'FIXES:\n\n{{#if fixes}}{{#each fixes}}{{> fix}}{{/each}}{{else}}{{> empty}}{{/if}}',
    fix: '  - {{{this}}}\n',
    empty: '  (none)\n'
  }, options.partials);
}


module.exports = function (grunt) {
  var _ = require('underscore');
  var Handlebars = require('handlebars');
  var moment = require('moment');
  var semver = require('semver');

  grunt.registerMultiTask('changelog', 'Generate a changelog based on commit messages.', function (after, before) {
    // Merge task-specific and/or target-specific options with these defaults.
    var options = this.options({
      featureRegex: /^(.*)closes #\d+:?(.*)$/gim,
      fixRegex: /^(.*)fixes #\d+:?(.*)$/gim,
      dest: 'changelog.txt',
      template: '{{> features}}{{> fixes}}',
      after: after,
      before: before
    });

    var sections = {};
    configureSections(options, sections, _);
    grunt.verbose.writeflags(sections, 'Sections');

    var isDateRange;

    // Determine if a date or a commit sha / tag was provided for the after
    // option. This will determine what kind of range we need to use.
    if (options.after) {

      if (!semver.valid(options.after)) {
        after = moment(options.after);
        isDateRange = after.isValid();
      }

      // Fallback to the provided after value if it is not a valid date. This
      // likely means that a commit sha or tag is being used.
      if (!isDateRange)
        after = options.after;
    } else {
      // If no after option is provided, default to using the last week.
      after = moment().subtract('days', 7);
      isDateRange = true;
    }

    if (isDateRange) {
      before = options.before ? moment(options.before) : moment();
    } else {
      before = options.before ? options.before : 'HEAD';
    }

    // Compile and register our templates and partials.
    var template = Handlebars.compile(options.template);

    var partials = sections.partials;
    for (var key in partials) {
      Handlebars.registerPartial(key, Handlebars.compile(partials[key]));
    }

    grunt.verbose.writeflags(options, 'Options');

    // Loop through each match and build the array of changes that will be
    // passed to the template.
    function getChanges(log, regex) {
      var changes = [];
      var match;

      while ((match = regex.exec(log))) {
        var change = '';

        for (var i = 1, len = match.length; i < len; i++) {
          change += match[i];
        }

        changes.push(change.trim());
      }

      return changes;
    }

    // Generate the changelog using the templates defined in options.
    function getChangelog(log) {

      var data = {
        date: moment().format('YYYY-MM-DD')
      };

      var collectedChanges = {};

      for (var key in sections.regex) {
        var changes = getChanges(log, sections.regex[key]);
        collectedChanges[key] = changes;
      }

      _.extend(data, collectedChanges);

      return template(data);
    }

    // Write the changelog to the destination file.
    function writeChangelog(changelog) {
      var fileContents = null;
      var firstLineFile = null;
      var firstLineFileHeader = null;
      var regex = null;

      if (options.insertType && grunt.file.exists(options.dest)) {
        fileContents = grunt.file.read(options.dest);
        firstLineFile = fileContents.split('\n')[0];
        grunt.log.debug('firstLineFile = ' + firstLineFile);

        switch (options.insertType) {
          case 'prepend':
            changelog = changelog + '\n' + fileContents;
            break;
          case 'append':
            changelog = fileContents + '\n' + changelog;
            break;
          default:
            grunt.fatal('"' + options.insertType + '" is not a valid insertType. Please use "append" or "prepend".');
            return false;
        }
      }

      if (options.fileHeader) {
        firstLineFileHeader = options.fileHeader.split('\n')[0];
        grunt.log.debug('firstLineFileHeader = ' + firstLineFileHeader);

        if (options.insertType === 'prepend') {
          if (firstLineFile !== firstLineFileHeader) {
            changelog = options.fileHeader + '\n\n' + changelog;
          } else {
            regex = new RegExp(options.fileHeader+'\n\n','m');
            changelog = options.fileHeader + '\n\n' + changelog.replace(regex, '');
          }

        // insertType === 'append' || undefined
        } else {
          if (firstLineFile !== firstLineFileHeader) {
            changelog = options.fileHeader + '\n\n' + changelog;
          }
        }

      }


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
      // get rid of empty lines in the log
      result = result.toString().replace(/\n\n/gm, '\n');
      writeChangelog(getChangelog(result));

      return;
    }

    var done = this.async();

    // Build our options for the git log command.
    // Default: Only print the commit message without paging.
    var args = [
      '--no-pager',
      'log'
    ];

    if (options.logArguments) {
      args.push.apply(args, options.logArguments);
    } else {
      args.push(
        '--pretty=format:%s',
        '--no-merges'
      );
    }

    if (isDateRange) {
      args.push('--after="' + after.format() + '"');
      args.push('--before="' + before.format() + '"');
    } else {
      args.splice(2, 0, after + '..' + before);
    }

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

        // get rid of empty lines in the log
        result = result.toString().replace(/\n\n/gm, '\n');
        writeChangelog(getChangelog(result));
        done();
      }
    );
  });
};
