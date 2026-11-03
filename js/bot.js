// Module 2: decides what the bot says back. Never touches the page.

// Rules are checked from top to bottom; the first one that matches wins.
// A rule matches when the message contains any of its keywords as whole
// words, so "hi" matches "hi there" but not "this". A keyword can also be
// a phrase like "how are you". To teach the bot something new, add a rule.
const botRules = [
  { keywords: ["how are you"], reply: "I'm doing great, thanks for asking!" },
  { keywords: ["your name", "who are you"], reply: "I'm a simple chatbot built with HTML, CSS and JavaScript." },
  { keywords: ["thanks", "thank you"], reply: "You're welcome!" },
  { keywords: ["help"], reply: "You can say hi, ask how I am, ask my name, or say bye." },
  { keywords: ["bye", "goodbye"], reply: "Goodbye! Have a nice day." },
  { keywords: ["hi", "hello", "hey"], reply: "Hello there! Nice to meet you." }
];

// Used when no rule matches
const fallbackReply = "Sorry, I don't understand yet. Type \"help\" to see what I know.";

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
        return rule.reply;
      }
    }
  }

  return fallbackReply;
}
