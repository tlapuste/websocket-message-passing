var express = require('express');
var app = express();
// server represents instance of express wrapped in 'http'
var server = require('http').Server(app);
// 'socket.io' instance called with http-wrapped express
var io = require('socket.io')(server);

// app.get('/', function(req,res) {
//   res.send("Hello world.");
//   console.log("GET-handler for express root.")
// });

app.use(express.static('app'));

// wait to run until something connects
io.on('connection', function(socket) {
  console.log("Something connected to Socket.io");
  // emit messages
  socket.emit("messages", ["Hello", "Hi there", "How are you?"]);
})

// Note that server is used here instead of app
server.listen(8080);
