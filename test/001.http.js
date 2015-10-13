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
		protocol: http,
		path: '/test-responder'
	}
});

console.log("Send any request to http://localhost:" + port + "/fake-proxy");