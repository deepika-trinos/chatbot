// Module 2: decides what the bot says back. Never touches the page.

// Rules are checked from top to bottom; the first one that matches wins.
// A rule matches when the message contains any of its keywords as whole
// words, so "hi" matches "hi there" but not "this". A keyword can also be
// a phrase like "how are you". To teach the bot something new, add a rule.
// A rule gives one fixed `reply: "..."`, a list `replies: [...]` that one is
// picked from at random each time, or a `replyFn: function () { ... }` that
// builds the reply when it's needed (handy for things like the time).
// Instead of keywords, a rule can have a `pattern: /regex/` that is tested
// against the cleaned message. Its replyFn then gets the match result, so
// the reply can use the captured words. A rule has keywords OR a pattern.

// Words that come after "i am" / "call me" but are not names, so messages
// like "im fine" or "call me later" don't set a name and go on to the next
// rules instead. Also stops a second word like "and" being kept in a name.
const notNames = [
  "a", "an", "the", "not", "so", "very", "really", "just", "also", "too",
  "fine", "good", "great", "ok", "okay", "well", "happy", "sad", "tired", "bored",
  "busy", "hungry", "sick", "sorry", "sure", "stuck", "lost", "confused", "done",
  "here", "back", "later", "now", "today", "from", "in", "at", "and", "going",
  "doing", "feeling", "please", "how", "what", "you"
];

// Matches one name word that isn't in notNames, e.g. "deepika" but not "fine"
const nameWord = "(?!(?:" + notNames.join("|") + ")\\b)([a-z]+)";

const botRules = [
  // Name rules come first so "my name is ..." wins over every other rule
  { keywords: ["forget my name"], replyFn: forgetName },
  { pattern: /\bwhat(?:s| is) my name\b/, replyFn: getNameReply },
  // "my name is deepika murugan" / "call me X" / "i am X" / "im X": up to two words
  {
    pattern: new RegExp("\\b(?:my name is|call me|i am|im) " + nameWord + "(?: " + nameWord + ")?"),
    replyFn: rememberName
  },
  {
    keywords: ["how are you"],
    replies: [
      "I'm doing great, thanks for asking!",
      "All good here! How about you?",
      "Feeling chatty today, thanks!"
    ]
  },
  { keywords: ["your name", "who are you"], reply: "I'm a simple chatbot built with HTML, CSS and JavaScript." },
  {
    keywords: ["thanks", "thank you"],
    replies: ["You're welcome!", "No problem!", "Happy to help!"]
  },
  {
    keywords: ["help"],
    reply: "You can say hi, tell me your name, ask how I am, ask my name, say \"forget my name\", " +
      "ask the time or date, ask for a joke, do simple maths like \"7 times 6\", or say bye."
  },
  {
    keywords: ["bye", "goodbye"],
    replies: ["Goodbye! Have a nice day.", "See you later!", "Bye! Come back soon."]
  },
  // Simple maths with words, e.g. "what is 12 plus 5" or "6 x 7 please".
  // The pattern isn't tied to the end, so words after it like "equals" are fine.
  { pattern: /\b(\d+) ?(plus|minus|times|x|multiplied by|divided by) ?(\d+)\b/, replyFn: getMathsReply },
  { keywords: ["time", "what time"], replyFn: getTimeReply },
  { keywords: ["date", "what day", "today"], replyFn: getDateReply },
  {
    keywords: ["joke", "funny"],
    replyFn: function () {
      return pickRandom(jokes);
    }
  },
  {
    keywords: ["hi", "hello", "hey"],
    replyFn: getGreetingReply
  }
];

// Said back to "hi"; one is picked at random, with the user's name added if known
const greetingReplies = ["Hello there! Nice to meet you.", "Hi! How can I help?", "Hey! Good to see you."];

// The user's name, e.g. "Deepika". Only kept until the page is reloaded
// (never saved to localStorage). null means we don't know it yet.
let userName = null;

// Used when no rule matches; one is picked at random
const fallbackReplies = [
  "Sorry, I don't understand yet. Type \"help\" to see what I know.",
  "Hmm, I'm not sure what you mean. Try typing \"help\".",
  "I didn't catch that. Type \"help\" to see what I can do."
];

// Told when someone asks for a joke; one is picked at random
const jokes = [
  "Why do programmers prefer dark mode? Because light attracts bugs.",
  "Why did the computer go to the doctor? It had a virus.",
  "How many programmers does it take to change a light bulb? None, that's a hardware problem.",
  "Why was the JavaScript developer sad? Because they didn't know how to null their feelings.",
  "Why did the chatbot cross the road? To get to the other site."
];

const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const monthNames = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

// Remembers the last index picked from each list, so the same reply
// doesn't come up twice in a row. The list itself is the key.
const lastPicks = new Map();

// Returns one random item from a list, never the same one as last time
// (unless the list only has one item)
function pickRandom(list) {
  let index = Math.floor(Math.random() * list.length);

  if (list.length > 1 && index === lastPicks.get(list)) {
    // Move to the next item, wrapping back to the start at the end
    index = (index + 1) % list.length;
  }

  lastPicks.set(list, index);
  return list[index];
}

// The current time, e.g. "It's 3:45 PM."
function getTimeReply() {
  const now = new Date();
  const hours = now.getHours();
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const period = hours < 12 ? "AM" : "PM";
  // 0 becomes 12 (midnight) and 13-23 become 1-11
  const hours12 = hours % 12 === 0 ? 12 : hours % 12;
  return "It's " + hours12 + ":" + minutes + " " + period + ".";
}

// Today's date, e.g. "Today is Tuesday, 3 November."
function getDateReply() {
  const now = new Date();
  return "Today is " + dayNames[now.getDay()] + ", " + now.getDate() + " " +
    monthNames[now.getMonth()] + ".";
}

// "deepika" -> "Deepika"
function capitalise(word) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

// "my name is deepika murugan" -> remembers "Deepika Murugan".
// match[2] is the second word, or undefined if there was only one.
function rememberName(match) {
  userName = capitalise(match[1]);
  if (match[2]) {
    userName = userName + " " + capitalise(match[2]);
  }
  return "Nice to meet you, " + userName + "!";
}

// "forget my name" -> clears the remembered name
function forgetName() {
  if (userName === null) {
    return "I don't know your name yet, so there's nothing to forget.";
  }
  userName = null;
  return "Okay, I've forgotten your name.";
}

// "what is my name" -> tells the user their name, if we know it
function getNameReply() {
  if (userName === null) {
    return "You haven't told me your name yet.";
  }
  return "Your name is " + userName + ".";
}

// A random greeting; when we know the name it goes before the first "!",
// e.g. "Hi! How can I help?" -> "Hi Deepika! How can I help?"
function getGreetingReply() {
  const greeting = pickRandom(greetingReplies);
  if (userName === null) {
    return greeting;
  }
  // "Nice to meet you" sounds odd when we already know them
  if (greeting === "Hello there! Nice to meet you.") {
    return "Hello there, " + userName + "! Nice to see you again.";
  }
  return greeting.replace("!", " " + userName + "!");
}

// "12 plus 5" -> "12 plus 5 is 17." The reply uses the word the user typed,
// e.g. "6 x 7 is 42." Whole numbers only; answers that aren't whole are
// rounded to 2 decimal places
function getMathsReply(match) {
  const first = Number(match[1]);
  const operation = match[2];
  const second = Number(match[3]);
  let answer;

  if (operation === "plus") {
    answer = first + second;
  } else if (operation === "minus") {
    answer = first - second;
  } else if (operation === "times" || operation === "x" || operation === "multiplied by") {
    answer = first * second;
  } else {
    if (second === 0) {
      return "I can't divide by zero!";
    }
    answer = first / second;
  }

  // Rounds to 2 decimal places, e.g. 3.3333 -> 3.33 (whole numbers stay whole)
  answer = Math.round(answer * 100) / 100;
  return first + " " + operation + " " + second + " is " + answer + ".";
}

// A rule with a `replyFn` calls it (passing the pattern match, if any);
// a `replies` list gets a random one; otherwise its single `reply`
function pickReply(rule, match) {
  if (typeof rule.replyFn === "function") {
    return rule.replyFn(match);
  }
  if (Array.isArray(rule.replies) && rule.replies.length > 0) {
    return pickRandom(rule.replies);
  }
  return rule.reply;
}

function getReply(text) {
  // Lowercase and remove punctuation so "Hi!" and "hi" count as the same,
  // then squash extra spaces: "  How   are you?? " -> "how are you"
  const cleaned = text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .split(/\s+/)
    .filter(word => word !== "")
    .join(" ");

  // Spaces on both ends let us search for " hi " and only find whole words
  const padded = " " + cleaned + " ";

  for (const rule of botRules) {
    // Pattern rules test the cleaned text with their regex instead
    if (rule.pattern) {
      const match = cleaned.match(rule.pattern);
      if (match) {
        return pickReply(rule, match);
      }
      continue;
    }

    for (const keyword of rule.keywords) {
      if (padded.includes(" " + keyword + " ")) {
        return pickReply(rule);
      }
    }
  }

  return pickRandom(fallbackReplies);
}
