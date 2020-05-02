const axios = require('axios');
const Telegraf = require('telegraf');

const dotenv = require('dotenv');
dotenv.config();

const TOKEN = process.env.TELEGRAM_TOKEN;
const bot = new Telegraf(TOKEN);

let dataStore = [];

getData();

bot.command('fact', (ctx) => {
  let maxRow = dataStore.filter((item) => {
    return item.row == '1' && item.col == '2';
  })[0].val;
  let k = Math.floor(Math.random() * maxRow) + 1;
  let fact = dataStore.filter((item) => {
    return item.row == k && item.col == '5';
  })[0];
  let message = `
Fact #${fact.row}:
${fact.val}
  `;
  ctx.reply(message);
});

bot.command('update', async (ctx) => {
  try {
    await getData();
    ctx.reply('updated');
  } catch (err) {
    console.log(err);
    ctx.reply('Error encountered');
  }
});

async function getData() {
  try {
    let res = await axios(
      'https://spreadsheets.google.com/feeds/cells/18OPa8VfDdAs_p1Ov1GZ5t5v-aVRD4yyNy4EsEyDHvmo/1/public/full?alt=json'
    );

    let data = res.data.feed.entry;
    dataStore = [];
    data.forEach((item) => {
      dataStore.push({
        row: item.gs$cell.row,
        col: item.gs$cell.col,
        val: item.gs$cell.inputValue,
      });
    });
  } catch (err) {
    console.log(err);
    throw new Error();
  }
}

bot.launch();
