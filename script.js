// Module 2: show your messages in the chat and give one fixed bot reply.

// Find the parts of the page we need to work with
const chatBox = document.getElementById("chat-box");
const chatForm = document.getElementById("chat-form");
const userInput = document.getElementById("user-input");

// Add one message bubble to the chat.
// sender is "user" or "bot", which picks the bubble's color and side.
function addMessage(text, sender) {
  const message = document.createElement("div");
  message.className = "message " + sender;
  message.textContent = text;
  chatBox.appendChild(message);

  // Scroll down so the newest message is always visible
  chatBox.scrollTop = chatBox.scrollHeight;
}

// Runs when you click Send or press Enter
chatForm.addEventListener("submit", function (event) {
  // Stop the browser from reloading the page
  event.preventDefault();

  const text = userInput.value.trim();

  // Ignore empty messages
  if (text === "") {
    return;
  }

  addMessage(text, "user");
  userInput.value = "";

  addMessage("Hello! I'm a bot.", "bot");
});
