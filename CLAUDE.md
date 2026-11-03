# CLAUDE.md

Guidance for Claude Code when working in this repository.

## Project

A simple practice chatbot website in plain HTML, CSS and JavaScript. No
frameworks, no build tools, no npm, no backend. Run it by opening `index.html`
in a browser. Chats are saved in the browser's `localStorage`.

Built in modules:
1. Layout and styling (chat window, phone and desktop widths)
2. Sending messages and showing a bot reply
3. Bot reply rules, multiple chats, saving to `localStorage`
4. History panel (drawer listing saved chats)

## Files

The scripts are classic `<script>` tags loaded at the end of `<body>` in this
order, and share one global scope (no modules, no imports):

1. `js/storage.js` - reads/saves data in `localStorage`. Never touches the page.
2. `js/bot.js` - decides the bot's reply. Never touches the page.
3. `js/ui.js` - draws things on the page. Never saves anything.
4. `js/app.js` - connects the other three: holds the data, handles events.

Keep these responsibilities separate. Because the scripts share globals, a
`const` declared at the top of one file can't be declared again in another
(that's why `app.js` uses names like `backdropLayer`/`historyListBox` for
elements `ui.js` also looks up).

- `index.html` - page structure: header (`#menu-btn`, `#new-chat-btn`),
  `#chat-box`, `#chat-form` (`#user-input`, `#send-btn`), `#backdrop`, and the
  `#history-drawer` (`#close-drawer-btn`, `#history-list`, `#clear-all-btn`).
- `style.css` - all styling. Colors and sizes are CSS variables on `:root`.
  The drawer and backdrop are shown by adding the class `open` to BOTH.
- `README.md` - short user-facing description; keep it true when files change.
- `task/` and `.claude/` are git-ignored.

## Data

Saved under the `localStorage` key `chatbot-data`:

```js
{
  currentChatId: "1730540120000" | null,   // null = an empty new chat is open
  chats: [
    { id, title, updatedAt, messages: [{ sender: "user" | "bot", text, time }] }
  ]
}
```

- `id` is `String(Date.now())`; `time`/`updatedAt` are `Date.now()` numbers.
- A chat is only created when its first message is sent, so empty chats are
  never saved. Its `title` is that first message, cut to 30 characters + "...".
- `loadData()` falls back to empty data if the saved JSON is missing or broken.

## Main functions

- `storage.js`: `loadData()`, `saveData(data)`
- `bot.js`: `getReply(text)` - first matching rule in `botRules` wins; keywords
  match whole words/phrases after lowercasing and removing punctuation. Falls
  back to a random entry of `fallbackReplies`. A rule has either `reply: "..."`
  or `replies: [...]` (picked at random by `pickReply(rule)` /
  `pickRandom(list)`). To teach the bot something, add a rule.
- `ui.js`: `renderMessage(message)`, `showGreeting()` (welcome bubble, never
  saved), `clearMessages()`, `showTyping()`, `hideTyping()`, `formatTime(time)`,
  `renderHistory(chats, currentChatId)` (sorts a copy newest first, marks the
  open chat `.active`, shows "No chats yet" and disables Clear all when empty),
  `formatHistoryDate(time)` (time today, "Yesterday", else e.g. "2 Nov"),
  `openDrawer()`, `closeDrawer()`
- `app.js`: `getChats()`, `getCurrentChatId()`, `openChat(id)`,
  `startNewChat()`, `deleteChat(id)`, `addMessage(chatId, message)`,
  `showCurrentChat()`, `refreshHistory()`

`addMessage`, `openChat`, `startNewChat` and `deleteChat` each save and call
`refreshHistory()`, so the history list stays in sync after every change.

## Behaviour worth preserving

- While the bot is "typing" (`BOT_TYPING_DELAY`, 600 ms), `sendButton.disabled`
  is true and `typingChatId` holds the chat being replied to. New chat is
  ignored during that time; opening another chat from history is allowed.
- The reply is added with the chat id captured at send time, so it lands in the
  right chat even if another chat is open. It is only drawn if that chat is on
  screen. If that chat was deleted, `addMessage` does nothing and Send is still
  re-enabled.
- `#history-list` uses ONE click listener (event delegation) reading
  `data-id`. The `.delete-btn` check runs first and returns, so deleting never
  also opens the chat. The drawer stays open after a delete and closes after
  opening a chat. Escape, the backdrop and `#close-drawer-btn` close it.
- Deleting the open chat (or Clear all) calls `startNewChat()`.
- User text and titles are always set with `textContent`, never `innerHTML`.

## Code style

Simple, beginner-friendly JavaScript: `function` declarations, `const`/`let`,
short plain-English comments above anything non-obvious, each file starts with
a one-line comment saying which modules it belongs to and what its job is.
Reuse the existing functions instead of writing new versions of them.

## Testing

There are no automated tests. Check changes by opening `index.html` at phone
width (~375px) and desktop width, and watch the console for errors.
`.claude/launch.json` has a `python -m http.server 8000` config, but note that
`localhost` and `file://` keep separate `localStorage`, so each has its own
saved chats.

## Git

The user does all git work (commits, pushes, branch switches) themselves.
Don't run git commands that change the repo; explain the commands instead.
