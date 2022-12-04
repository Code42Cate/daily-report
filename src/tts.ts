import { loadConfig } from "./config";
import { TextToSpeechClient } from "@google-cloud/text-to-speech";
import { writeFileSync, rmSync } from "fs";

const { GOOGLE_API_KEY, GOOGLE_PROJECT_ID, SPEAKING_RATE } = loadConfig();

// Write service account key to file because I can't figure out how to pass it as a string
const keyFilename = "pem.json";
writeFileSync(keyFilename, GOOGLE_API_KEY, {});

// Probably not necessary but I'm paranoid
process.on("exit", () => {
  rmSync(keyFilename);
});

const client = new TextToSpeechClient({
  projectId: GOOGLE_PROJECT_ID,
  keyFile: keyFilename,
});

export const synthesize = async (text: string) => {
  // This could break if text is more than 5000 characters
  // TODO: split text into chunks

  const [response] = await client.synthesizeSpeech({
    input: { text },
    voice: {
      languageCode: "en-US",
      ssmlGender: "FEMALE",
      name: "en-US-Neural2-G",
    },
    audioConfig: { audioEncoding: "MP3", speakingRate: SPEAKING_RATE },
  });

  if (response && response.audioContent) {
    return Buffer.from(response.audioContent);
  }

  return null;
};
