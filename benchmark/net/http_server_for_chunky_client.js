'use strict';

var path = require('path');
var http = require('http');
var fs = require('fs');
var spawn = require('child_process').spawn;
var common = require('../common.js')
var test = require('../../test/common.js')
var pep = path.dirname(process.argv[1]) + '/chunky_http_client.js';
var PIPE = test.PIPE;

var server;
try {
  fs.unlinkSync(PIPE);
} catch (e) { /* ignore */ }

server = http.createServer(function(req, res) {
  res.writeHead(200, { 'content-type': 'text/plain',
                       'content-length': '2' });
  res.end('ok');
});

server.on('error', function(err) {
  throw new Error('server error: ' + err);
});

try {
  var child;

  server.listen(PIPE);

  child = spawn(process.execPath, [pep], { });

  child.on('error', function(err) {
    throw new Error('spawn error: ' + err );
  });

  child.stdout.pipe(process.stdout);

  child.on('exit', function (exitCode) {
    console.error('Child exited with code: ' + exitCode);
  });

} catch(e) {
  throw new Error('error: ' + e );
}
