import * as dotenv from "dotenv";
dotenv.config();

import { TextToSpeechClient } from "@google-cloud/text-to-speech";
import TelegramBot from "node-telegram-bot-api";
import rssParser from "rss-parser";
import { Configuration, OpenAIApi } from "openai";
import { rmSync, writeFileSync } from "fs";

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
const GOOGLE_PROJECT_ID = process.env.GOOGLE_PROJECT_ID;
const TELEGRAM_API_KEY = process.env.TELEGRAM_API_KEY;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

if (
  !GOOGLE_API_KEY ||
  !GOOGLE_PROJECT_ID ||
  !TELEGRAM_API_KEY ||
  !TELEGRAM_CHAT_ID ||
  !OPENAI_API_KEY
) {
  throw new Error("Missing API Keys");
}

const keyFilename = "pem.json";
writeFileSync(keyFilename, GOOGLE_API_KEY);

// Google API Client
const client = new TextToSpeechClient({
  projectId: GOOGLE_PROJECT_ID,
  keyFile: keyFilename,
});

// Telegram Bot
const bot = new TelegramBot(TELEGRAM_API_KEY);

const configuration = new Configuration({
  apiKey: OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const feeds = ["https://www.techmeme.com/feed.xml"];

const getLast24HoursItems = async (feedUrl: string) => {
  const parser = new rssParser();
  // Get the current time
  const now = new Date();

  const feed = await parser.parseURL(feedUrl);

  // Filter the items that were added in the last 24 hours
  const items = feed.items.filter((item) => {
    const date = new Date(item.pubDate ?? "");
    return now.getTime() - date.getTime() < 24 * 60 * 60 * 1000;
  });

  // Return the items
  return items;
};

const sendAudio = async (audio: Buffer, text: string) => {
  const dailyReportTitle = `Daily Report ${new Date().toDateString()}.mp3`;

  return bot.sendAudio(
    TELEGRAM_CHAT_ID,
    audio,
    {
      title: dailyReportTitle,
      caption: text,
    },
    {
      filename: dailyReportTitle,
      contentType: "audio/mpeg",
    }
  );
};

// Performs the Text-to-Speech request
const synthesize = async (text: string) => {
  const [response] = await client.synthesizeSpeech({
    input: { text: text },
    voice: {
      languageCode: "en-US",
      ssmlGender: "FEMALE",
      name: "en-US-Neural2-G",
    },
    audioConfig: { audioEncoding: "MP3", speakingRate: 1.2 },
  });

  if (response && response.audioContent) {
    return Buffer.from(response.audioContent);
  }

  return null;
};

const summarize = async (text: string) => {
  const asciiText = text.replace(/[^\x00-\x7F]/g, "");

  const tokenCount = Math.floor(asciiText.length / 4);

  // use openai to summarize text with maximum tokenCount
  const summary = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: `${asciiText} Please summarize each section in a snappy way.`,
    max_tokens: tokenCount,
  });

  const summaryText = summary.data.choices[0].text ?? "Ahhh it failed";

  return summaryText;
};

const main = async () => {
  const items = await Promise.all(feeds.map(getLast24HoursItems));
  // combine all items into title + contentSnippet
  const combinedText = items
    .flat()
    .reduce((acc, item) => `${acc}${item.contentSnippet}\n---\n`, "");

  const summary = await summarize(combinedText);

  const audio = await synthesize(summary);

  rmSync(keyFilename);

  if (audio) {
    await sendAudio(audio, summary);
  }
};

main();
