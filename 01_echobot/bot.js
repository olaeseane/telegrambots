const Telegraf = require('telegraf');
const dotenv = require('dotenv');

dotenv.config();

const TOKEN = process.env.TELEGRAM_TOKEN;
const bot = new Telegraf(TOKEN);

const helpMessage = `
Say something to me
/start - start the bot
/help - command reference
/echo - say "You said echo"
/echo <msg> - echo a message
`;

bot.use((ctx, next) => {
  if (ctx.updateSubTypes[0] == 'text') {
    bot.telegram.sendMessage(
      process.env.CHAT_ID,
      ctx.from.username + ' said: ' + ctx.message.text
    );
  } else {
    bot.telegram.sendMessage(
      process.env.CHAT_ID,
      ctx.from.username + ' sent ' + ctx.updateSubTypes[0]
    );
  }
  next();
});

bot.start((ctx) => {
  ctx.reply('Hi I am Echo Bot');
  ctx.reply(helpMessage);
});

bot.help((ctx) => {
  ctx.reply(helpMessage);
});

bot.command('echo', (ctx) => {
  let input = ctx.message.text;
  let inputArray = input.split(' ');
  let message = '';

  if (inputArray.length == 1) {
    message = 'You said echo';
  } else {
    inputArray.shift();
    message = inputArray.join(' ');
  }

  ctx.reply(message);
});

bot.launch();
