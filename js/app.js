// Modules 2-4: connects storage, bot and ui, and handles clicks and the current chat.

// How long the bot "types" before its reply appears, in milliseconds
const BOT_TYPING_DELAY = 600;

// Chat titles longer than this are cut short and end with "..."
const TITLE_LENGTH = 30;

const chatForm = document.getElementById("chat-form");
const userInput = document.getElementById("user-input");
const sendButton = document.getElementById("send-btn");
const newChatButton = document.getElementById("new-chat-btn");

// All saved chats plus which one is open: { currentChatId, chats }
let data = loadData();

// The id of the chat the bot is typing a reply for, otherwise null
let typingChatId = null;

// Every message is stored as one of these objects
function createMessage(sender, text) {
  return { sender: sender, text: text, time: Date.now() };
}

// Returns the chat with this id, or undefined if there isn't one
function findChat(id) {
  return data.chats.find(chat => chat.id === id);
}

// Turns a long first message into a short title: "a very long message th..."
function makeTitle(text) {
  if (text.length <= TITLE_LENGTH) {
    return text;
  }
  return text.slice(0, TITLE_LENGTH).trim() + "...";
}

// Makes a new chat, adds it to the list and opens it.
// Only called when the first message is sent, so empty chats are never saved.
function createChat(firstText) {
  const chat = {
    id: String(Date.now()),
    title: makeTitle(firstText),
    updatedAt: Date.now(),
    messages: []
  };
  data.chats.push(chat);
  data.currentChatId = chat.id;
  return chat;
}

// Adds a message to the chat with this id and saves straight away.
// We pass the id (not "the current chat") so a late bot reply still
// lands in the chat it belongs to, even if another chat is open now.
function addMessage(chatId, message) {
  const chat = findChat(chatId);

  // The chat was deleted while the bot was typing, so there's nowhere to put it
  if (!chat) {
    return;
  }

  chat.messages.push(message);
  chat.updatedAt = message.time;
  saveData(data);
}

// Redraws the chat box for the open chat (or the greeting if there isn't one)
function showCurrentChat() {
  clearMessages();
  const chat = findChat(data.currentChatId);

  if (!chat || chat.messages.length === 0) {
    showGreeting();
    return;
  }

  // Just draw the saved messages; they are already saved, so don't save again
  for (const message of chat.messages) {
    renderMessage(message);
  }

  // Coming back to a chat that's still waiting for its reply
  if (typingChatId === chat.id) {
    showTyping();
  }
}

// --- Functions for the history panel (Module 4) ---

function getChats() {
  return data.chats;
}

function getCurrentChatId() {
  return data.currentChatId;
}

function openChat(id) {
  if (!findChat(id)) {
    startNewChat();
    return;
  }

  data.currentChatId = id;
  saveData(data);
  showCurrentChat();
}

function startNewChat() {
  data.currentChatId = null;
  saveData(data);
  showCurrentChat();
  userInput.focus();
}

function deleteChat(id) {
  data.chats = data.chats.filter(chat => chat.id !== id);

  // If we just deleted the open chat, show an empty one instead
  if (data.currentChatId === id) {
    startNewChat();
  } else {
    saveData(data);
  }
}

// --- Events ---

// Runs when you click Send or press Enter
chatForm.addEventListener("submit", function (event) {
  // Stop the browser from reloading the page
  event.preventDefault();

  const text = userInput.value.trim();

  // Ignore empty messages, and wait until the bot has answered the last one
  if (text === "" || sendButton.disabled) {
    return;
  }

  // The first message of a new chat creates the chat and removes the greeting
  let chat = findChat(data.currentChatId);
  if (!chat) {
    chat = createChat(text);
    clearMessages();
  }

  // Remember which chat this is, in case the user opens another one meanwhile
  const chatId = chat.id;

  const userMessage = createMessage("user", text);
  addMessage(chatId, userMessage);
  renderMessage(userMessage);
  userInput.value = "";

  sendButton.disabled = true;
  typingChatId = chatId;
  showTyping();

  setTimeout(function () {
    hideTyping();
    typingChatId = null;

    const botMessage = createMessage("bot", getReply(text));
    addMessage(chatId, botMessage);

    // Only draw the reply if its chat is still the one on screen
    if (data.currentChatId === chatId) {
      renderMessage(botMessage);
    }

    sendButton.disabled = false;
    userInput.focus();
  }, BOT_TYPING_DELAY);
});

newChatButton.addEventListener("click", function () {
  // Wait for the bot to finish its reply first
  if (sendButton.disabled) {
    return;
  }
  startNewChat();
});

// On page load, show the chat that was open last time
showCurrentChat();
