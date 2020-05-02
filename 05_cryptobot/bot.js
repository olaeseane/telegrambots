const axios = require('axios');
const Telegraf = require('telegraf');

const dotenv = require('dotenv');
dotenv.config();

const TOKEN = process.env.TELEGRAM_TOKEN;
const bot = new Telegraf(TOKEN);

//api key from https://min-api.cryptocompare.com/
const apikey =
  'da070e2781369c2446227b7e2cf515cdee789f3d853e03569f40c608492471dd';

bot.command('start', (ctx) => {
  sendStartMessage(ctx);
});

bot.action('start', (ctx) => {
  ctx.deleteMessage();
  sendStartMessage(ctx);
});

function sendStartMessage(ctx) {
  let startMessage = `Welcome, this bot gives you cryptocurrency information`;
  bot.telegram.sendMessage(ctx.chat.id, startMessage, {
    reply_markup: {
      inline_keyboard: [
        [{ text: 'Crypto Prices', callback_data: 'price' }],
        [{ text: 'CoinMarketCap', url: 'https://coinmarketcap.com/' }],
        [{ text: 'Bot Info', callback_data: 'info' }],
      ],
    },
  });
}

bot.action('price', (ctx) => {
  let priceMessage = `Get Price Information. Select one of the cryptocurrencies below`;

  ctx.deleteMessage();
  bot.telegram.sendMessage(ctx.chat.id, priceMessage, {
    reply_markup: {
      inline_keyboard: [
        [
          { text: 'BTC', callback_data: 'price-BTC' },
          { text: 'ETH', callback_data: 'price-ETH' },
        ],
        [
          { text: 'BCH', callback_data: 'price-BCH' },
          { text: 'LTC', callback_data: 'price-LTC' },
        ],
        [{ text: 'Back to Menu', callback_data: 'start' }],
      ],
    },
  });
});

let priceActionList = ['price-BTC', 'price-ETH', 'price-BCH', 'price-LTC'];
bot.action(priceActionList, async (ctx) => {
  let symbol = ctx.match.split('-')[1];

  try {
    let res = await axios.get(
      `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${symbol}&tsyms=USD&api_key=${apikey}`
    );
    let data = res.data.DISPLAY[symbol].USD;

    let message = `
Symbol: ${symbol}
Price: ${data.PRICE}
Open: ${data.OPENDAY}
High: ${data.HIGHDAY}
Low: ${data.LOWDAY}
Supply: ${data.SUPPLY}
Market Cap: ${data.MKTCAP}
`;

    ctx.deleteMessage();
    bot.telegram.sendMessage(ctx.chat.id, message, {
      reply_markup: {
        inline_keyboard: [[{ text: 'Back to prices', callback_data: 'price' }]],
      },
    });
  } catch (err) {
    console.log(err);
    ctx.reply('Error Encountered');
  }
});

bot.action('info', (ctx) => {
  ctx.answerCbQuery();
  bot.telegram.sendMessage(ctx.chat.id, 'Bot Info', {
    reply_markup: {
      keyboard: [
        [{ text: 'Credits' }, { text: 'API' }],
        [{ text: 'Remove Keyboard' }],
      ],
      resize_keyboard: true,
      one_time_keyboard: true,
    },
  });
});

bot.hears('Credits', (ctx) => {
  ctx.reply('This bot was made by @name');
});

bot.hears('API', (ctx) => {
  ctx.reply('This bot uses cryptocompare API');
});

bot.hears('Remove Keyboard', (ctx) => {
  bot.telegram.sendMessage(ctx.chat.id, 'Removed Keyboard', {
    reply_markup: {
      remove_keyboard: true,
    },
  });
});

bot.launch();
