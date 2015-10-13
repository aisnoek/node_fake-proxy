Fake proxy
==========

This module rather is a 'forwarder of requests' than it being a standard "HTTP Proxy".

Literaly forwarding requests became necessary when an online service did not offer an ip-address, or even
a fixed range, to white-list. And as standard "HTTP Proxy" appeared to be forwarding to much information
of the actual sender and therefor again resulting in a denial of access this 'fake-proxy' was created.

Installation
------------

Install using `npm`:

``` bash
$ npm install fake-proxy
```

Or clone the repository manually.

Usage
-----

In the example directory you'll find a client-to-server sample:

``` bash
$ node example/001.http.js
```

Basic usage:

``` js
var proxy = require('fake-proxy');

proxy({
    proxy: {
        app: app, // adds the proxy to your express instance
        path: '/fake-proxy', // path to listen to
        allowed_methods: ['GET', 'POST', 'DELETE', 'PUT']
    },
    recipient: {
        host: 'example.com',
        port: 80,
        protocol: 'http',
        path: '/your_service'
    }
});
```

