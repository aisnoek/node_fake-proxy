/*!
 * fake-proxy
 * Copyright (c) 2015 Manuel Snoek
 *
 * ISC licensed
 */

'use strict';

// load modules
var express = require('express');

var qs = require('qs');
var bodyParser = require('body-parser');

/**
 * Usage:
 *
 * fake_proxy({
 *   proxy: {
 *   	app: <instance of express>,
 *   	path: '/proxy'
 *   	allowed_methods: ['GET', 'POST', 'DELETE', 'PUT']
 *   }
 *   recipient: {
 *     host: 'localhost',
 *     port: 80,
 *     protocol: 'http', // 'http', 'https' or <instance of http(s)>
 *     path: '/path/to/request'
 *   },
 * })
 *
 * @param options <object>
 */
module.exports = function (options) {
	var proxy = options.proxy;
	var app = proxy.app;
	var recipient = options.recipient;

	// listen to all methods
	app.all(proxy.path, function (req, res, next) {

		// prevent methods used in requests by only specify the ones allowed
		if (typeof proxy.allowed_methods == "array") {
			if (proxy.allowed_methods.indexOf(req.method.toUpperCase()) == -1) {
				res.sendStatus(405); // Method not allowed
				next();
			}
		}

		// prepare body for parsing application/json
		app.use(proxy.path, bodyParser.json());
		// prepare body for parsing application/x-www-form-urlencoded
		app.use(proxy.path, bodyParser.urlencoded({ extended: true }));

		var body = (req.body) ? req.body : '';

		// configure recipient request
		var recipient_options = {
			host: recipient.host,
			port: recipient.port,
			method: req.method,
			path: recipient.path + '?' + qs.stringify(req.query),
			headers: {
				'content-length': stringify(body).length
			}
		};

		if (typeof req.headers['content-type'] != 'undefined') {
			recipient_options.headers['content-type'] = req.headers['content-type'];
		}

		// require('http') || require('https')
		var protocol = (typeof recipient.protocol == "object")
			? recipient.protocol
			: require(recipient.protocol);

		var fakeProxyRequest = protocol.request(recipient_options, function (recipient_response) {
			recipient_response.on('data', function (data) {
				res.header('Content-Type', recipient_response.headers['content-type']);
				res.send(data.toString());
			});
		});

		fakeProxyRequest.on('error', function (err) {
			console.log('[ERROR]', err);
			res.send('something went wrong, take a look at your console');
		});

		fakeProxyRequest.write(stringify(body));
		fakeProxyRequest.end();
	});

	function stringify(body, content_type) {
		return (content_type == 'application/json')
			? JSON.stringify(body)
			: qs.stringify(body);
	}
};