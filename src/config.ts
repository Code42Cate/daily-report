import * as dotenv from "dotenv";
dotenv.config();

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
const GOOGLE_PROJECT_ID = process.env.GOOGLE_PROJECT_ID;
const TELEGRAM_API_KEY = process.env.TELEGRAM_API_KEY;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

const SPEAKING_RATE = 1.2;

// Be careful with adding more feeds, I only tried techmeme.com
const RSS_FEEDS = ["https://www.techmeme.com/feed.xml"];

if (
  !GOOGLE_API_KEY ||
  !GOOGLE_PROJECT_ID ||
  !TELEGRAM_API_KEY ||
  !TELEGRAM_CHAT_ID ||
  !OPENAI_API_KEY
) {
  throw new Error("Missing API Keys");
}

export const loadConfig = () => {
  return {
    GOOGLE_API_KEY,
    GOOGLE_PROJECT_ID,
    TELEGRAM_API_KEY,
    TELEGRAM_CHAT_ID,
    OPENAI_API_KEY,
    RSS_FEEDS,
    SPEAKING_RATE,
  };
};
