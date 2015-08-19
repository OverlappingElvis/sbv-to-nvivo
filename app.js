#!/usr/bin/env node

var fs = require('fs');
var q = require('q');
var _ = require('underscore');
var os = require('os');
var normalize = require('normalize-newline');

var delimiter = '<<<break>>>';
var usage = 'sbv-to-nvivo <filename>.sbv to generate <filename>.txt';
var inputFilename = process.argv[2];

if (!inputFilename) {
	console.log('No file provided.');
	console.log(usage);
	return;
}

var splitFilename = inputFilename.split('.sbv');

if (splitFilename.length !== 2) {
	console.log('Invalid file extension.');
	console.log(usage);
	return;
}

var outputFilename = splitFilename[0] + '.txt';

var readFile = function() {
	var deferred = q.defer();
	fs.readFile(inputFilename, function(err, data) {
		if (err) {
			deferred.reject(err);
		}
		deferred.resolve(normalize(data.toString()));
	});
	return deferred.promise;
};

var writeFile = function(data) {
	var deferred = q.defer();
	fs.writeFile(outputFilename, data, function(err) {
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
	var joined = _(groups).map(function(group) {
			var join = _(group.split(',')).compact();
			join.splice(1, 1);
			return join[0] + ',' + _(join).rest().join(' ');
		});
	return joined.join(os.EOL);
};

readFile()
	.then(transformFile)
	.then(writeFile)
	.then(function() {
		console.log('Wrote ' + outputFilename);
	})
	.fail(function(err) {
		throw err;
	});
