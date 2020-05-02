const config = require('../../config');

module.exports = (bot) => {
  bot.command(['start', 'help'], (ctx) => {
    let message = config.helpMessage;
    ctx.reply(message, {
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: 'Search Pixabay Image',
              switch_inline_query_current_chat: 'p ',
            },
          ],
          [{ text: 'Search Wiki', switch_inline_query_current_chat: 'w ' }],
        ],
      },
    });
  });
};
