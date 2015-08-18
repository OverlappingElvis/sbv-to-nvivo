#!/usr/bin/env node

var fs = require('fs');
var q = require('q');
var _ = require('underscore');
var os = require('os');
var stdin = require('get-stdin');

var delimiter = '<<<break>>>';

stdin(function(filename) {
	readFile()
		.then(transformFile)
		.then(writeFile)
		.then(function() {
			console.log('Done.');
		})
		.fail(function(err) {
			throw err;
		});

	function readFile() {
		var deferred = q.defer();
		fs.readFile(filename, function(err, data) {
			if (err) {
				deferred.reject(err);
			}
			deferred.resolve(data.toString());
		});
		return deferred.promise;
	}

	function writeFile(data) {
		var deferred = q.defer();
		fs.writeFile(_(filename.split('.sbv')).first() + '.txt', data, function(err) {
			if (err) {
				deferred.reject(err);
			}
			deferred.resolve();
		});
		return deferred.promise;
	}

	function transformFile(file) {
		var groups = _(file.split('\r\n')).map(function(item) {
			if (item === '') {
				return delimiter;
			}
			return item;
		}).join().split(delimiter);
		var joined = _(groups).map(function(group) {
			var join = _.compact(group.split(','));
			join.splice(1, 1);
			return join[0] + ',' + _(join).rest().join(' ');
		});
		return joined.join(os.EOL);
	}
});
