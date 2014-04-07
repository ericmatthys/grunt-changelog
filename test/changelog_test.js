'use strict';

var grunt = require('grunt');

/*
  ======== A Handy Little Nodeunit Reference ========
  https://github.com/caolan/nodeunit

  Test methods:
    test.expect(numAssertions)
    test.done()
  Test assertions:
    test.ok(value, [message])
    test.equal(actual, expected, [message])
    test.notEqual(actual, expected, [message])
    test.deepEqual(actual, expected, [message])
    test.notDeepEqual(actual, expected, [message])
    test.strictEqual(actual, expected, [message])
    test.notStrictEqual(actual, expected, [message])
    test.throws(block, [error], [message])
    test.doesNotThrow(block, [error], [message])
    test.ifError(value)
*/

exports.changelog = {
  default_options: function (test) {
    test.expect(1);

    var actual = grunt.file.read('tmp/changelog_default');
    var expected = grunt.file.read('test/expected/default');
    test.equal(actual, expected, 'The changelog should be generated with the default options.');

    test.done();
  },

  formatting_options: function (test) {
    test.expect(1);

    var actual = grunt.file.read('tmp/changelog_formatting');
    var expected = grunt.file.read('test/expected/formatting');
    test.equal(actual, expected, 'The custom template in options should be used to create the changelog.');

    test.done();
  },

  regex_options: function (test) {
    test.expect(1);

    var actual = grunt.file.read('tmp/changelog_regex');
    var expected = grunt.file.read('test/expected/regex');
    test.equal(actual, expected, 'The custom regex in options should be used to match changes in the log.');

    test.done();
  },

  empty_partial: function (test) {
    test.expect(1);

    var actual = grunt.file.read('tmp/changelog_empty');
    var expected = grunt.file.read('test/expected/empty');
    test.equal(actual, expected, 'The empty partial in options should be used in the changelog.');

    test.done();
  },

  prepend: function (test) {
    test.expect(1);

    var actual = grunt.file.read('tmp/changelog_prepend');
    var expected = grunt.file.read('test/expected/prepend');
    test.equal(actual, expected, 'The changelog should be prepended.');

    test.done();
  },

  append: function (test) {
    test.expect(1);

    var actual = grunt.file.read('tmp/changelog_append');
    var expected = grunt.file.read('test/expected/append');
    test.equal(actual, expected, 'The changelog should be appended.');

    test.done();
  },
};
