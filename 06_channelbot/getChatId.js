const Telegraf = require('telegraf');

const dotenv = require('dotenv');
dotenv.config();

const TOKEN = process.env.TELEGRAM_TOKEN;
const bot = new Telegraf(TOKEN);

bot.use((ctx) => {
  console.log(ctx.chat);
});

bot.launch();
