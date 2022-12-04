import { loadConfig } from './config';
import { Configuration, OpenAIApi } from 'openai';

const { OPENAI_API_KEY } = loadConfig();

const configuration = new Configuration({
  apiKey: OPENAI_API_KEY
});

const openai = new OpenAIApi(configuration);

export const summarize = async (text: string) => {
  // tts probably explodes if we give it emojis or sth crazy
  // eslint-disable-next-line no-control-regex
  const asciiText = text.replace(/[^\x00-\x7F]/g, '');

  // prevent gpt-3 from generating more text than we provided it
  // a token is roughly 4 characters
  const tokenCount = Math.floor(asciiText.length / 4);

  const summary = await openai.createCompletion({
    model: 'text-davinci-003',
    prompt: `${asciiText} Please summarize each section in a snappy way.`,
    max_tokens: tokenCount
  });

  const summaryText = summary.data.choices[0].text ?? 'Ahhh it failed';

  return summaryText;
};
