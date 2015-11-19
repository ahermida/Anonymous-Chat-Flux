//SOCKET IO GLOBAL
var isNode = (typeof process != 'undefined' && typeof process.versions != 'undefined' && typeof process.versions.node != 'undefined');
var localSock;
if (!isNode) {
  localSock = window.location.hostname;
} else {
  localSock = "localhost:8080"
}
var socket = require('socket.io-client')(localSock);
// Not to be used on the server
  module.exports = socket;
