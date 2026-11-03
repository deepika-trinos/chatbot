// Module 3: reads and saves chats in localStorage. Never touches the page.

// Everything is saved under this one key
const STORAGE_KEY = "chatbot-data";

// What we start with when nothing has been saved yet
function emptyData() {
  return { currentChatId: null, chats: [] };
}

// Returns the saved { currentChatId, chats } object
function loadData() {
  const saved = localStorage.getItem(STORAGE_KEY);

  if (saved === null) {
    return emptyData();
  }

  // JSON.parse throws an error if the saved text is broken, so catch it
  try {
    const data = JSON.parse(saved);

    // Make sure it really looks like our data before using it
    if (data && Array.isArray(data.chats)) {
      return data;
    }
  } catch (error) {
    console.warn("Saved chats could not be read, starting fresh.", error);
  }

  return emptyData();
}

// localStorage can only hold text, so turn the object into JSON first
function saveData(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}
