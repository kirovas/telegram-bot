// Import required libraries
const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');
const dotenv = require('dotenv');
// Load environment variables
dotenv.config();
// Initialize the Telegram bot
const bot = new TelegramBot(process.env.TELEGRAM_API_KEY, { polling: true });
// Define the OpenAI API URL
const OPENAI_API_URL = 'https://api.openai.com/v1/engines/davinci-codex/completions';
// Define GPT-4 completion function
async function getGpt4Completion(prompt) {
  const response = await axios.post(
    OPENAI_API_URL,
    {
      prompt: prompt,
      max_tokens: 50,
      n: 1,
      stop: null,
      temperature: 0.5,
    },
    {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      }
    }
  );
  return response.data.choices[0].text.trim();
}
// Listen for any message updates
bot.on('message', async (msg) => {
  const chatId = msg.chat.id;
  const userMessage = msg.text;
  try {
    const gpt4Response = await getGpt4Completion(userMessage);
    bot.sendMessage(chatId, gpt4Response);
  } catch (error) {
    console.error(error);
    bot.sendMessage(chatId, 'Error: Unable to process your message.');
  }
});