// have user initialize with their id or get from storage
// localStorage will return null
var userId = localStorage.getItem("userId") || randomId();
localStorage.setItem("userId", userId);
console.info("Hi I'm user #" + userId);

function randomId() {
  return Math.floor(Math.random() * 1e11);
}


// setting `forceNew` means force a new connnection every time attempt 
// don't use caching
var socket = io.connect('http://localhost:8080', {'forceNew': true});

socket.on("messages", function(data) {
  console.info(data);
  var html = data.map(function(data){
    return (`
            <div class='name'>
              ${data.userName}
            </div>
            <a href=${data.content.link} class='message' target=blank>
              ${data.content.text}
            </a>
              <input type=submit class="likes-count" value="${data.likedBy.length} Likes">
    `)
  }).join(" ");
  document.getElementById("messages").innerHTML = html;
});
 

function addMessage(e){
  var payload = {
    userName:document.getElementById("username").value,
    content: {
      text:document.getElementById("message").value,
      link:document.getElementById("linkAddress").value
    },
    likedBy:[],
    ts: Date.now()
  }
  // pass payload of arbitrary message type "new-message" to already-defined socket
  socket.emit("new-message", payload);
  return false;
}
