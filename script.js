// Module 2: show your messages in the chat.
// Module 3: the bot picks its reply based on what you typed.

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

// Decide what the bot says back to your message
function getBotReply(text) {
  // Make everything lowercase so "HELLO" and "hello" count as the same,
  // and remove punctuation so "Hi!" still counts as "hi"
  const cleaned = text.toLowerCase().replace(/[^a-z\s]/g, "");

  // Split the message into separate words, e.g. "hi there" -> ["hi", "there"]
  const words = cleaned.split(/\s+/);

  // Rules are checked from top to bottom; the first one that matches wins
  if (cleaned.includes("how are you")) {
    return "I'm doing great, thanks for asking!";
  }
  if (words.includes("bye")) {
    return "Goodbye! Have a nice day.";
  }
  if (words.includes("hi") || words.includes("hello")) {
    return "Hello there! Nice to meet you.";
  }

  // None of the rules matched
  return "Sorry, I don't understand yet.";
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

  addMessage(getBotReply(text), "bot");
});
