var express = require('express');
var app = express();
// server represents instance of express wrapped in 'http'
var server = require('http').Server(app);
// 'socket.io' instance called with http-wrapped express
var io = require('socket.io')(server);

app.use(express.static('app'));

var messages = [{
  userId: 1,
  messageId: 10,
  userName: "Tudor Lapuste",
  content: {
    text: "It's me",
    link: "tlapuste.com"
  },
  likedBy:[1],
  ts: Date.now() - 10000
},{
  userId: 2,
  messageId: 11,
  userName: "Mario",
  content: {
    text: "It's a me, Mario!",
    link: "mario.com"
  },
  likedBy:[2,3],
  ts: Date.now() - 100000
},{
  userId: 3,
  messageId: 14,
  userName: "Luigi",
  content: {
    text: "Why you never remember my name mama",
    link: "luigi.com"
  },
  likedBy:[],
  ts: Date.now() - 1000000
}]

// wait to run until something connects
io.on('connection', function(socket) {
  console.log("Something connected to Socket.io");
  // emit messages on connection
  socket.emit("messages", messages);
  socket.on("new-message", function(data) {
    messages.push(data);
    // again emit data whenever a new message is added
    // make it io.sockets.emit to give socket ability to communicate
    io.sockets.emit("messages",messages);
  });

  socket.on("update-message", function(data) {
    var message = messages.filter(function(message) {
      return message.messageId == data.messageId;
    })[0];

    message.likedBy = data.likedBy;
    io.sockets.emit("messages", messages);
  });
})

// Note that server is used here instead of app
server.listen(8080);
