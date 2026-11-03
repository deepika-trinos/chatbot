// Modules 2-4: connects storage, bot and ui, and handles clicks and the current chat.

// How long the bot "types" before its reply appears, in milliseconds
const BOT_TYPING_DELAY = 600;

const chatForm = document.getElementById("chat-form");
const userInput = document.getElementById("user-input");
const sendButton = document.getElementById("send-btn");

// Every message is stored as one of these objects; Module 3 will save them
function createMessage(sender, text) {
  return { sender: sender, text: text, time: Date.now() };
}

// Runs when you click Send or press Enter
chatForm.addEventListener("submit", function (event) {
  // Stop the browser from reloading the page
  event.preventDefault();

  const text = userInput.value.trim();

  // Ignore empty messages, and wait until the bot has answered the last one
  if (text === "" || sendButton.disabled) {
    return;
  }

  renderMessage(createMessage("user", text));
  userInput.value = "";

  sendButton.disabled = true;
  showTyping();

  setTimeout(function () {
    hideTyping();
    renderMessage(createMessage("bot", getReply(text)));
    sendButton.disabled = false;
    userInput.focus();
  }, BOT_TYPING_DELAY);
});
