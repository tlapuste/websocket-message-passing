// have user initialize with their id or get from storage
// localStorage will return null
var userId = localStorage.getItem("userId") || randomId();
localStorage.setItem("userId", userId);
console.info("Hi I'm user #" + userId);
var messageCache;

function randomId() {
  return Math.floor(Math.random() * 1e11);
}


// setting `forceNew` means force a new connnection every time attempt 
// don't use caching
var socket = io.connect('http://localhost:8080', {'forceNew': true});

socket.on("messages", function(data) {
  console.info(data);
  messageCache = data;
  render();
});

function render() {
  var data = messageCache;
  var html = data.map(function(data, index){
    return (`
          <form class="message" onsubmit="return likeMessage(messageCache[${index}])">
            <div class='name'>
              ${data.userName}
            </div>
            <a href=${data.content.link} class='message' target=blank>
              ${data.content.text}
            </a>
              <input type=submit class="likes-count" value="${data.likedBy.length} Likes">
          </form>
    `)
  }).join(" ");

  document.getElementById("messages").innerHTML = html;
}

function likeMessage(message) {
  var index = message.likedBy.indexOf(userId);
  if (index < 0) {
    message.likedBy.push(userId);
  } else {
    message.likedBy.splice(index, 1);
  }
  socket.emit("update-message", message);
  render();
  return false; // so page refresh
}

function addMessage(e){
  var payload = {
    messageId:randomId(),
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
