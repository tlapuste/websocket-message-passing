
// setting `forceNew` means force a new connnection every time attempt 
// don't use caching
var socket = io.connect('http://localhost:8080', {'forceNew': true});

socket.on("messages", function(data) {
  console.info(data);
});
