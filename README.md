[![Daily Build and Start](https://github.com/Code42Cate/daily-report/actions/workflows/daily-run.yml/badge.svg)](https://github.com/Code42Cate/daily-report/actions/workflows/daily-run.yml)
# Daily News Report Bot

This project is a daily news report that is generated using Google's Text-to-Speech API and sent to a Telegram chat as an audio file. The news articles are sourced from a list of RSS feeds and summarized using OpenAI's GPT-3 model.

## Getting Started
To use this project, you will need to create a `.env` file and provide the following environment variables:

```
GOOGLE_API_KEY: The JSON pem file for your TTS Google Cloud Service Account
GOOGLE_PROJECT_ID: The ID of the Google Cloud project.
TELEGRAM_API_KEY: The API key for a Telegram bot.
TELEGRAM_CHAT_ID: The ID of the Telegram chat where the news report will be sent.
OPENAI_API_KEY: The API key for an OpenAI API account.
```
Once you have provided these values in your `.env` file, you can install the project dependencies by running:

`npm install`
Then, build the project by running:

`npm run build`

Finally, start the script by running:

`npm start`

The daily news report will be generated and sent to the specified Telegram chat.

If you want it to run automatically, use the GitHub Actions workflow in the .github/workflows folder. You will need to provide the same environment variables in the GitHub repository secrets.

# License
This project is licensed under the MIT License - see the LICENSE file for details.