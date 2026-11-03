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

// The welcome bubble shown on an empty chat. It has no time and is never saved.
function showGreeting() {
  const bubble = document.createElement("div");
  bubble.className = "message bot";
  bubble.textContent = "Hello! Type a message to start chatting.";
  chatBox.appendChild(bubble);
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

// True if a and b (time numbers or Dates) are on the same calendar day.
// toDateString() is like "Mon Nov 03 2026", so it ignores the time of day
function isSameDay(a, b) {
  return new Date(a).toDateString() === new Date(b).toDateString();
}

// The label for a day: "Today", "Yesterday", otherwise "Sun 1 Nov"
function formatDayLabel(time) {
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  if (isSameDay(time, today)) {
    return "Today";
  }
  if (isSameDay(time, yesterday)) {
    return "Yesterday";
  }
  return new Date(time).toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" });
}

// The full date and time, like "Tue 3 Nov 2026, 10:42"
function formatFullDate(time) {
  const date = new Date(time);
  // The weekday is added on its own, because with a year en-GB puts a comma after it ("Tue, 3 Nov")
  const weekday = date.toLocaleDateString("en-GB", { weekday: "short" });
  const day = date.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
  return weekday + " " + day + ", " + formatTime(time);
}

// --- History panel (Module 4) ---

const historyList = document.getElementById("history-list");
const historyDrawer = document.getElementById("history-drawer");
const backdrop = document.getElementById("backdrop");
const clearAllButton = document.getElementById("clear-all-btn");

// The date shown under a chat title: "10:42" today, "Yesterday", otherwise "2 Nov"
function formatHistoryDate(time) {
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  if (isSameDay(time, today)) {
    return formatTime(time);
  }
  if (isSameDay(time, yesterday)) {
    return "Yesterday";
  }
  return new Date(time).toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}

// Draws one row per chat, newest first, and highlights the open one
function renderHistory(chats, currentChatId) {
  historyList.replaceChildren();

  // Nothing to delete when there are no chats
  clearAllButton.disabled = chats.length === 0;

  if (chats.length === 0) {
    const empty = document.createElement("li");
    empty.className = "history-empty";
    empty.textContent = "No chats yet";
    historyList.appendChild(empty);
    return;
  }

  // slice() makes a copy, so sorting doesn't change the order of the saved chats
  const sorted = chats.slice().sort((a, b) => b.updatedAt - a.updatedAt);

  for (const chat of sorted) {
    const item = document.createElement("li");
    item.className = "history-item";
    // app.js reads this to know which chat was clicked
    item.dataset.id = chat.id;
    if (chat.id === currentChatId) {
      item.classList.add("active");
    }

    const text = document.createElement("div");
    text.className = "history-text";

    const title = document.createElement("span");
    title.className = "history-title";
    // textContent (not innerHTML) so a title like <b> shows as plain text
    title.textContent = chat.title;

    const date = document.createElement("span");
    date.className = "history-date";
    date.textContent = formatHistoryDate(chat.updatedAt);

    text.appendChild(title);
    text.appendChild(date);

    const deleteButton = document.createElement("button");
    deleteButton.className = "delete-btn";
    deleteButton.type = "button";
    deleteButton.setAttribute("aria-label", "Delete chat");
    deleteButton.textContent = "×";

    item.appendChild(text);
    item.appendChild(deleteButton);
    historyList.appendChild(item);
  }
}

function openDrawer() {
  historyDrawer.classList.add("open");
  backdrop.classList.add("open");
}

function closeDrawer() {
  historyDrawer.classList.remove("open");
  backdrop.classList.remove("open");
}
