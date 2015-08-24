#!/usr/bin/env node

var fs = require('fs');
var q = require('q');
var _ = require('underscore');
var os = require('os');
var normalize = require('normalize-newline');
var glob = require('glob');

var delimiter = '<<<break>>>';
var usage = 'Usage: sbv-to-nvivo [filenames]';

var filenames = _(process.argv).rest(2);

if (!filenames.length) {
	console.log('No files provided.');
	console.log(usage);
	return;
}

var readFile = function(filename) {
	var deferred = q.defer();
	fs.readFile(filename, function(err, data) {
		if (err) {
			deferred.reject(err);
		}
		deferred.resolve(normalize(data.toString().replace(/^\s+|\s+$/g, '')));
	});
	return deferred.promise;
};

var writeFile = function(data, filename) {
	var deferred = q.defer();
	fs.writeFile(filename, data, function(err) {
		if (err) {
			deferred.reject(err);
		}
		deferred.resolve();
	});
	return deferred.promise;
};

var transformFile = function(file) {
	var groups = _(file.split('\n'))
		.map(function(item) {
			if (item === '') {
				return delimiter;
			}
			return item;
		})
		.join()
		.split(delimiter);
	var joined = _(groups).chain()
		.compact()
		.map(function(group) {
			var join = _(group.split(',')).compact();
			join.splice(1, 1);
			return join[0] + ',' + _(join).rest().join(' ');
		})
		.value();
	return joined.join(os.EOL);
};

var translateFile = function(filename) {
	var splitFilename = filename.split('.sbv');

	if (splitFilename.length !== 2) {
		console.log('Invalid file extension.');
		console.log(usage);
		return;
	}

	var outputFilename = splitFilename[0] + '.txt';
	
	return readFile(filename)
		.then(transformFile)
		.then(_(writeFile).partial(_, outputFilename))
		.then(function() {
			console.log('Wrote ' + outputFilename);
		})
		.fail(function(err) {
			throw err;
		});
};

var translateAll = function(filenames) {
	_(filenames).each(translateFile);
};

if (filenames.length === 1 && filenames[0].indexOf('*') !== -1) {
	glob(filenames[0], function(err, filenames) {
		translateAll(filenames);
	});
} else {
	translateAll(filenames);
}
