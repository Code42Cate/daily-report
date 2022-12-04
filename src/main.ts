import { synthesize } from "./tts";
import { sendAudio } from "./telegram";
import { summarize } from "./openai";
import { getAllFeedsCombined } from "./rss";

const main = async () => {
  const combinedText = await getAllFeedsCombined();

  const summary = await summarize(combinedText);

  const audio = await synthesize(summary);

  if (audio) {
    await sendAudio(audio, summary);
  }
};

main();
