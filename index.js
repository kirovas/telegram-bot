// Import required libraries
const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');
const dotenv = require('dotenv');
let conversation = '';
// Load environment variables
dotenv.config();
// Initialize the Telegram bot
const bot = new TelegramBot(process.env.TELEGRAM_API_KEY, { polling: true });
// Define the OpenAI API URL
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';
// Define GPT-4 completion function
async function getGpt4Completion(prompt) {
    const messages = `Conversation:\n${conversation}\nUser: ${prompt}\nAI:`;
  const response = await axios.post(
    OPENAI_API_URL,
    {
      //prompt: prompt,
      messages: [
        { role: "user", content: messages }
      ],
      model: 'gpt-3.5-turbo',
      //max_tokens: 50,
      n: 1,
      stop: null,
      temperature: 0.5
    },
    {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      }
    }
  );
  const answer = response.data.choices[0].message.content;
  conversation += `\nUser: ${prompt}\nAI: ${answer}`;
  return answer;
}
// Listen for any message updates
bot.onText(/\/start/, (msg) => {

  bot.sendMessage(msg.chat.id, "Welcome");
  
});
bot.on('message', async (msg) => {
  const chatId = msg.chat.id;
  const userMessage = msg.text;
  try {
    const gpt4Response = await getGpt4Completion(userMessage).then(answer => {
        return answer;
    });
    bot.sendMessage(chatId, gpt4Response);
  } catch (error) {
    console.error(error);
    bot.sendMessage(chatId, 'Error: Unable to process your message.');
  }
});