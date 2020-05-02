const axios = require('axios');

const apikey = process.env.PIXABAY_APIKEY;

module.exports = (bot) => {
  bot.inlineQuery(/p\s.+/, async (ctx) => {
    let input = ctx.inlineQuery.query.split(' ');
    input.shift();
    let query = input.join(' ');

    let res = await axios.get(
      `https://pixabay.com/api/?key=${apikey}&q=${query}`
    );
    let data = res.data.hits;

    let results = data.map((item, index) => {
      return {
        type: 'photo',
        id: String(index),
        photo_url: item.webformatURL,
        thumb_url: item.previewURL,
        photo_width: 300,
        photo_height: 200,
        caption: `[Source](${item.webformatURL})\n[Large Image](${item.largeImageURL})`,
        parse_mode: 'Markdown',
      };
    });
    ctx.answerInlineQuery(results);
  });
};
