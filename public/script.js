// public/script.js
const socket = io();
const input = document.getElementById('messageInput');
const sendButton = document.getElementById('sendButton');
const messages = document.getElementById('messages');

let username = '';
while (!username.trim()) {
  username = prompt("Enter your name:");
}

// Helper to format message HTML
function createMessageElement({ username: sender, text, timestamp }) {
  const li = document.createElement('li');
  li.classList.add('message');
  li.classList.add(sender === username ? 'you' : 'other');

  li.innerHTML = `
    <span class="username">${sender}</span>
    <div>${text}</div>
    <span class="timestamp">${timestamp}</span>
  `;

  return li;
}

// Fetch existing messages
fetch('/messages')
  .then(res => res.json())
  .then(data => {
    data.forEach(msg => {
      messages.appendChild(createMessageElement(msg));
    });
    messages.scrollTop = messages.scrollHeight;
  });

// Send message on button click
sendButton.addEventListener('click', sendMessage);

// Or Enter key
input.addEventListener('keypress', function (e) {
  if (e.key === 'Enter') sendMessage();
});

function sendMessage() {
  const text = input.value.trim();
  if (text) {
    socket.emit('chat message', { username, text });
    input.value = '';
  }
}

// Receive new message
socket.on('chat message', function (msg) {
  messages.appendChild(createMessageElement(msg));
  messages.scrollTop = messages.scrollHeight;
});
