// Module 2: decides what the bot says back. Never touches the page.

// Rules are checked from top to bottom; the first one that matches wins.
// A rule matches when the message contains any of its keywords as whole
// words, so "hi" matches "hi there" but not "this". A keyword can also be
// a phrase like "how are you". To teach the bot something new, add a rule.
// A rule gives either one fixed `reply: "..."` or a list `replies: [...]`
// that one is picked from at random each time.
const botRules = [
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
  { keywords: ["help"], reply: "You can say hi, ask how I am, ask my name, or say bye." },
  {
    keywords: ["bye", "goodbye"],
    replies: ["Goodbye! Have a nice day.", "See you later!", "Bye! Come back soon."]
  },
  {
    keywords: ["hi", "hello", "hey"],
    replies: ["Hello there! Nice to meet you.", "Hi! How can I help?", "Hey! Good to see you."]
  }
];

// Used when no rule matches; one is picked at random
const fallbackReplies = [
  "Sorry, I don't understand yet. Type \"help\" to see what I know.",
  "Hmm, I'm not sure what you mean. Try typing \"help\".",
  "I didn't catch that. Type \"help\" to see what I can do."
];

// Returns one random item from a list
function pickRandom(list) {
  return list[Math.floor(Math.random() * list.length)];
}

// A rule with a `replies` list gets a random one; otherwise its single `reply`
function pickReply(rule) {
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
    for (const keyword of rule.keywords) {
      if (padded.includes(" " + keyword + " ")) {
        return pickReply(rule);
      }
    }
  }

  return pickRandom(fallbackReplies);
}
