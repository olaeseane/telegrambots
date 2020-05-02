// const fetch = require('node-fetch');

let newDescription = inputData.description.replace(
  '(Feed generated with FetchRSS )',
  ''
);

let message = `
Description:
${newDescription}
<a href="${inputData.link}">Source</a>
`;

let token = 'xxx';
let data = {
  chat_id: '-1001161505335',
  text: message,
  parse_mode: 'HTML',
  reply_markup: {
    inline_keyboard: [[{ text: 'Go to Post', url: inputData.link }]],
  },
};

// (async () => {

await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
  method: 'POST',
  body: JSON.stringify(data),
  headers: {
    'Content-Type': 'application/json',
  },
});

output = [{ id: 123, hello: 'world' }];

// })();
