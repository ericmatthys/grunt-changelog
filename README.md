[![npm version](https://badge.fury.io/js/grunt-changelog.svg)](http://badge.fury.io/js/grunt-changelog) [![Build Status](https://travis-ci.org/ericmatthys/grunt-changelog.svg)](https://travis-ci.org/ericmatthys/grunt-changelog) [![devDependency Status](https://david-dm.org/ericmatthys/grunt-changelog/dev-status.svg)](https://david-dm.org/ericmatthys/grunt-changelog#info=devDependencies)  [![Dependency Status](https://david-dm.org/ericmatthys/grunt-changelog/status.svg)](https://david-dm.org/ericmatthys/grunt-changelog#info=Dependencies) [![peerDependency Status](https://david-dm.org/ericmatthys/grunt-changelog/peer-status.svg)](https://david-dm.org/ericmatthys/grunt-changelog#info=peerDependencies)

# grunt-changelog

## Getting Started
This plugin requires Grunt `~0.4.0`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-changelog --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-changelog');
```

## The "changelog" task

### Overview
In your project's Gruntfile, add a section named `changelog` to the data object passed into `grunt.initConfig()`. The task, by default, will go through the last 7 days of commit messages, looking for issues that were closed or fixed. It will then generate a template-based changelog with those changes and write them to a destination file.

```js
grunt.initConfig({
  changelog: {
    sample: {
      options: {
        // Task-specific options go here.
      }
    }
  },
})
```

```
NEW:

  - Feature 1
  - Feature 2
  - Feature 3

FIXES:

  - Fix 1
  - Fix 2
```

### Options

####options.fileHeader
Type: `String`
Default value: `undefined `

The string will be placed on top of the changelog. 

#### options.after
Type: `String`
Default value: `7 days ago`

A date string, commit SHA, or tag that the git log will start at.

#### options.before
Type: `String`
Default value: `now`

A date string, commit SHA, or tag that the git log will end at. The type must match what was used for after (e.g. you cannot use a date string for after and a commit SHA for before).

#### options.featureRegex
Type: `RegEx`
Default value: `/^(.*)closes #\d+:?(.*)$/gim`

The regular expression used to match feature changes.

#### options.fixRegex
Type: `RegEx`
Default value: `/^(.*)fixes #\d+:?(.*)$/gim`

The regular expression used to match bug fix changes.

#### options.log
Type: `String`
Default value: `undefined`

The log file to parse for changes. If nothing is set, a git log command will be run.

#### options.dest
Type: `String`
Default value: `changelog`

The file path to write the changelog to.

#### options.insertType
Type: `String`
Default value: `undefined`

Can be set to `prepend`, or `append`.  This will prepend / append the changelog to the file set by `options.dest`.  If nothing is set, the `options.dest` file will be overwritten.

#### options.template
Type: `String`
Default value: `{{> features}}{{> fixes}}`

The Handlebars template used for creating the changelog.

#### options.partials.features
Type: `String`
Default value: `'NEW:\n\n{{#if features}}{{#each features}}{{> feature}}{{/each}}{{else}}{{> empty}}{{/if}}\n'`

The Handlebars partial used for the list of features.

#### options.partials.feature
Type: `String`
Default value: `'  - {{{this}}}\n'`

The Handlebars partial used for each individual feature.

#### options.partials.fixes
Type: `String`
Default value: `'FIXES:\n\n{{#if fixes}}{{#each fixes}}{{> fix}}{{/each}}{{else}}{{> empty}}{{/if}}'`

The Handlebars partial used for the list of fixes.

#### options.partials.fix
Type: `String`
Default value: `'  - {{{this}}}\n'`

The Handlebars partial used for each individual fix.

#### options.partials.empty
Type: `String`
Default value: `'  (none)\n'`

The Handlebars partial used by features or fixes when there are no changes.

#### options.logArguments
Type: `Array`
Default value: `['--pretty=format:%s', '--no-merges']`

See <http://git-scm.com/book/en/Git-Basics-Viewing-the-Commit-History>

### Usage Examples

#### Default Options
In this example, the default options are used to create the changelog. A git log command will run for logs starting 7 days ago until now and the changelog will be generated matching commit messages with fixes and closes.

```js
grunt.initConfig({
  changelog: {
    sample: {
      options: {}
    }
  },
})
```

changelog.txt
```
NEW:

  - Feature 1
  - Feature 2
  - Feature 3

FIXES:

  - Fix 1
  - Fix 2
```

#### File header
This examples uses the option `fileHeader` to prepend a custom string to the changelog.

```js
grunt.initConfig({
  changelog: {
    sample: {
      options: {
       fileHeader: '# Changelog'
      }
    }
  },
})
```

changelog.txt
```
# Changelog

NEW:

  - Feature 1
  - Feature 2
  - Feature 3

FIXES:

  - Fix 1
  - Fix 2
```


#### Custom Range
In this example, a custom date range is used to only show changes between March 1st and March 14th.

```js
grunt.initConfig({
  changelog: {
    sample: {
      options: {
        after: '2013-03-01',
        before: '2013-03-14'
      }
    }
  },
})
```

You can also pass values for after and before directly.

From 1/12/2014 to today

```
$ grunt changelog:sample:1/12/2014
```

From commit dffcc01 to 6408ff7

```
$ grunt changelog:sample:dffcc01:6408ff7
```

From tag 0.9.8 to HEAD

```
$ grunt changelog:sample:0.9.8
```

#### Custom Destination
In this example, a custom destination is used to write the changelog to a different location.

```js
grunt.initConfig({
  changelog: {
    sample: {
      options: {
        dest: 'release-notes/<%= package.version %>.txt'
      }
    }
  },
})
```

#### Custom Formatting
In these examples, custom formatting is used to create a simple changelog with the list of features and fixes.

```js
grunt.initConfig({
  changelog: {
    sample: {
      options: {
        dest: 'release-notes/<%= package.version %>.txt',
        template: '{{date}}\n\n{{> features}}{{> fixes}}'
      }
    }
  },
})
```

release-notes/1.0.0.txt
```
2013-05-01

NEW:

  - Feature 1
  - Feature 2
  - Feature 3

FIXES:

  - Fix 1
  - Fix 2
```

```js
grunt.initConfig({
  changelog: {
    sample: {
      options: {
        dest: 'release-notes/<%= package.version %>.txt',
        partials: {
          features: '{{#each features}}{{> feature}}{{/each}}',
          feature: '[NEW] {{this}}\n',
          fixes: '{{#each fixes}}{{> fix}}{{/each}}',
          fix: '[FIX] {{this}}\n'
        }
      }
    }
  },
})
```

release-notes/1.0.0.txt
```
[NEW] Feature 1
[NEW] Feature 2
[NEW] Feature 3
[FIX] Fix 1
[FIX] Fix 2
```

#### Custom `git log` arguments

The following example generates a simple changelog without separation of Commit types.

```js
grunt.initConfig({
  changelog: {
    sample: {
      options: {
        logArguments: [
          '--pretty=* %h - %ad: %s',
          '--no-merges',
          '--date=short'
        ],
        template: '{{> features}}',
        featureRegex: /^(.*)$/gim,
        partials: {
          features: '{{#if features}}{{#each features}}{{> feature}}{{/each}}{{else}}{{> empty}}{{/if}}\n',
          feature: '- {{this}} {{this.date}}\n'
        }
      }
    }
  },
})
```

changelog.txt

```
* c0d309b - 2014-08-20: Fix typo in readme. 
* 7d84867 - 2014-04-11: Bumped to 0.2.2 
* 2280e9c - 2014-04-07: Optionally prepend or append the changelog.  Fixes #5
```

## Contributing

Anyone and everyone is welcome to contribute. Please take a moment to
review the [guidelines for contributing](CONTRIBUTING.md).

* [Bug reports](CONTRIBUTING.md#bugs)
* [Feature requests](CONTRIBUTING.md#features)
* [Pull requests](CONTRIBUTING.md#pull-requests)
