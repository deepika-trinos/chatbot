// Module 3: reads and saves chats in localStorage. Never touches the page.

// Everything is saved under this one key
const STORAGE_KEY = "chatbot-data";

// What we start with when nothing has been saved yet
function emptyData() {
  return { currentChatId: null, chats: [] };
}

// Returns the saved { currentChatId, chats } object
function loadData() {
  // getItem throws if the browser blocks storage, and JSON.parse throws
  // if the saved text is broken, so catch both
  try {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (saved === null) {
      return emptyData();
    }

    const data = JSON.parse(saved);

    // Make sure it really looks like our data before using it
    if (data && Array.isArray(data.chats)) {
      // Drop any chat without a messages list, so drawing it can't crash
      data.chats = data.chats.filter(chat => chat && Array.isArray(chat.messages));
      return data;
    }
  } catch (error) {
    console.warn("Saved chats could not be read, starting fresh.", error);
  }

  return emptyData();
}

// localStorage can only hold text, so turn the object into JSON first.
// If saving fails (storage full or blocked), the chat keeps working,
// it just isn't saved.
function saveData(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.warn("Chats could not be saved.", error);
  }
}
