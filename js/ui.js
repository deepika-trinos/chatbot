// Modules 2 and 4: draws messages and the history list on the page. Never saves anything.

const chatBox = document.getElementById("chat-box");

// The "typing..." bubble while it's on screen, otherwise null
let typingBubble = null;

// Turns a time like 1730540120000 into "10:42"
function formatTime(time) {
  return new Date(time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function scrollToBottom() {
  chatBox.scrollTop = chatBox.scrollHeight;
}

// Draws one message bubble. message is { sender, text, time },
// and sender ("user" or "bot") picks the bubble's color and side.
function renderMessage(message) {
  const bubble = document.createElement("div");
  bubble.className = "message " + message.sender;
  // textContent (not innerHTML) so typed text like <b> shows as plain text
  bubble.textContent = message.text;

  const time = document.createElement("span");
  time.className = "message-time";
  time.textContent = formatTime(message.time);
  bubble.appendChild(time);

  chatBox.appendChild(bubble);
  scrollToBottom();
}

// Removes every bubble, e.g. before showing a different chat
function clearMessages() {
  chatBox.replaceChildren();
  typingBubble = null;
}

function showTyping() {
  if (typingBubble) {
    return;
  }

  typingBubble = document.createElement("div");
  typingBubble.className = "message bot typing";
  typingBubble.setAttribute("aria-label", "Bot is typing");

  // The three dots; style.css makes them bounce
  for (let i = 0; i < 3; i++) {
    typingBubble.appendChild(document.createElement("span"));
  }

  chatBox.appendChild(typingBubble);
  scrollToBottom();
}

function hideTyping() {
  if (typingBubble) {
    typingBubble.remove();
    typingBubble = null;
  }
}
