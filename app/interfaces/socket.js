//SOCKET IO GLOBAL
var socket = require('socket.io-client')('http://localhost:8080/');
// Not to be used on the server
  module.exports = socket;
