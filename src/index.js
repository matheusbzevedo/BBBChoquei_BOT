const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const port = process.env.PORT || 3000;
const keys = require('./config/keys');
const { Telegraf } = require('telegraf');
const api = require('./config/axios');
const cors = require('cors');
const bot = new Telegraf(keys.telegram.token);
const cron = require('cron').CronJob;
const { response } = require('express');

app.use(express.json());
app.use(cors());
app.get('/', (request, response) => {
  return response.status(200).json({ bot: 'ON 🚀' });
})

const participantes = [
  'lais',
  'luciano',
  'jessilane',
  'eli',
  'eslovenia',
  'lucas',
  'barbara',
  'arthuraguiar',
  'rodrigo',
  'natalia',
  'vinicius',
  'scooby',
  'bruna'
];

let brunou = 0;
let flamengo = 0;

let lastTweet = "";

bot.start((ctx) => ctx.reply(`
Notícias sobre BBB vindo da Choquei
`));

bot.help((ctx) => ctx.reply(`
/vasco - fala o que todos somos
/nome do participante - último tweet sobre BBB
/bruno - quantas vezes o bruno brunou
/flamengo - quantas vezes o bruno falou do flamengo neste recipiente
`));

bot.command('participantes', (ctx) => {
  let texto = "Participantes: \n\n";

  participantes.map(participante => {
    texto += `/${participante} \n`;
  });

  ctx.reply(texto);
});

bot.command('vasco', (ctx) => ctx.reply('AQUI É VASCO MESMO!'));

bot.command(participantes, (ctx) => {
  const nome = ctx.update.message.text.split('/')[1];

 ctx.reply(`Você quer saber por ${nome}, logo logo teremos novidades!`);
});

bot.command('bruno', (ctx) => {
  ++brunou;

  ctx.reply(`Bruneco brunou ${brunou}`);
});

bot.command('flamengo', (ctx) => {
  ++flamengo;

  ctx.reply(`Foi a ${flamengo} vez que o Bruno falou do Flamengo`);
});

bot.command('last', (ctx) => {
  api.get().then(response => {
    const { data } = response.data;

    lastTweet = data[0].id;
    ctx.reply(data[0].text);
  })
  .catch(error => console.error(error))
})

bot.launch();

new cron('* * * * 0-6', () => {
  sendTweet();
}).start();

function sendTweet() {
  api.get().then(response => {
    const { data } = response.data;

    if (data[0].id === lastTweet) return;

    lastTweet = data[0].id;

    bot.telegram.sendMessage(-1001351415122, data[0].text);
  })
  .catch(error => console.error(error))
}

server.listen(port, () => console.log(`Server listening on port: ${port}`));
