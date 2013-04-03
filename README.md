# grunt-changelog

>

## Getting Started
This plugin requires Grunt `~0.4.0`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-changelog --save-dev
```

One the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-changelog');
```

## The "changelog" task

### Overview
In your project's Gruntfile, add a section named `changelog` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
	changelog: {
		options: {
			// Task-specific options go here.
		}
	},
})
```

### Options

#### options.after
Type: `String`
Default value: `7 days ago`

An ISO-8601 date string that the git log will start at.

#### options.before
Type: `String`
Default value: `now`

An ISO-8601 date string that the git log will end at.

#### options.featureRegex
Type: `RegEx`
Default value: `/^(.*)closes #\d+:?(.*)$/gim`

The regular expression used to match feature changes.

#### options.fixRegex
Type: `RegEx`
Default value: `/^(.*)fixes #\d+:?(.*)$/gim`

The regular expression used to match bug fix changes.

#### options.file
Type: `String`
Default value: `undefined`

The log file to parse for changes. If nothing is set, a git log command will be run.

#### options.dest
Type: `String`
Default value: `changelog`

The filepath to write the changelog to.

#### options.templates.main
Type: `String`
Default value: `NEW:\n\n{{features}}\nFIXES:\n\n{{fixes}}`

The main template used for creating the changelog.

#### options.templates.change
Type: `String`
Default value: `  - {{change}}\n`

The template used for creating each individual change.

#### options.templates.empty
Type: `String`
Default value: `  (none)\n`

The template used when no changes were found.

### Usage Examples

#### Default Options
In this example, the default options are used to create the changelog. A git log command will run for logs starting 7 days ago until now and the changelog will be generated matching commit messages with fixes and closes.

```js
grunt.initConfig({
	changelog: {
		options: {}
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

#### Custom Range
In this example, a custom date range is used to only show changes between March 1st and March 14th.

```js
grunt.initConfig({
	changelog: {
		options: {
			after: '2013-03-01',
			before: '2013-03-14'
		}
	},
})
```

#### Custom Destination
In this example, a custom destination is used to write the changelog to a different location.

```js
grunt.initConfig({
	changelog: {
		options: {
			dest: 'release-notes/1.0.0.txt'
		}
	},
})
```

#### Custom Formatting
In this example, custom formatting is used to create a simple changelog with the list of features and fixes.

```js
grunt.initConfig({
	changelog: {
		options: {
			templates: {
				main: '{{features}}{{fixes}}',
				change: '  - {{change}}\n',
				empty: '\n'
			}
		}
	},
})
```

```
  - Feature 1
  - Feature 2
  - Feature 3
  - Fix 1
  - Fix 2
```

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
_(Nothing yet)_
