import TelegramBot from 'node-telegram-bot-api';
import { loadConfig } from './config';
const { TELEGRAM_API_KEY, TELEGRAM_CHAT_ID } = loadConfig();

const bot = new TelegramBot(TELEGRAM_API_KEY);

export const sendAudio = async (audio: Buffer, text: string) => {
  const dailyReportTitle = `Daily Report ${new Date().toDateString()}.mp3`;

  return bot.sendAudio(
    TELEGRAM_CHAT_ID,
    audio,
    {
      title: dailyReportTitle,
      caption: text
    },
    {
      filename: dailyReportTitle,
      contentType: 'audio/mpeg'
    }
  );
};
