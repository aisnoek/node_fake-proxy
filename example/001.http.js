/*!
 * fake-proxy
 * Copyright (c) 2015 Manuel Snoek
 *
 * Copyright (c) 4-digit year, Company or Person's Name
 *
 * Permission to use, copy, modify, and/or distribute this software for any purpose with or without fee is hereby granted, provided that the above copyright notice and this permission notice appear in all copies.
 *
 * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
 *
 */

var express = require('express');
var app = express();
var http = require('http');

var port = 8080;

app.listen(port);

// set up a responder for the test
app.all('/test-responder', function (req, res, next) {
	res.send({
		proxy: "works",
		headers: req.headers,
		method: req.method
	});
});

// load fake-proxy
var proxy = require('../index.js');

proxy({
	proxy: {
		app: app,
		path: '/fake-proxy'
//		allowed_methods: ['GET', 'POST', 'DELETE', 'PUT']
	},
	recipient: {
		host: 'localhost',
		port: port,
		protocol: 'http',
		path: '/test-responder'
	}
});

console.log("Send any request to http://localhost:" + port + "/fake-proxy");