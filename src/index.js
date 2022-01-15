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
const { participantes } = require('./participantes.json');
const participantesIds = participantes.map(participante => participante.id);
const package = require('./../package.json');

app.use(express.json());
app.use(cors());
app.get('/', (request, response) => {
  return response.status(200).json({
    bot: 'ON 🚀',
    name: package.name,
    repository: package.repository,
    version: package.version
  });
})

let lastTweet = "";

bot.start((ctx) => ctx.reply(`
Notícias sobre BBB vindo da Choquei
`));

bot.help((ctx) => ctx.reply(`
/lista - exibe lista de participantes com informações
/last - último tweet da @choquei
/participante - informações como nome, instagram e se foi eliminado

https://github.com/matheusbzevedo/BBBChoquei_BOT
`));

bot.command('lista', (ctx) => {
  let texto = "Participantes: \n\n";

  participantes.map(participante => {
    texto += `/${participante.id} - ${participante.nome} - ${participante.instagram} \n\n`;
  });

  ctx.reply(texto);
});

bot.command(participantesIds, (ctx) => {
  const id = ctx.update.message.text.split('/')[1];
  const participante = participantes.filter(p => p.id === id)[0];
  let texto = "Participante \n\n";
  texto += `Nome: ${participante.nome}\n`;
  texto += `Tipo: ${participante.tipo}\n`;
  texto += `Instagram: ${participante.instagram}\n`;
  texto += `Cidade: ${participante.cidade}\n`;
  texto += `Eliminado: ${isEliminado(participante.eliminado)}\n`;

  ctx.reply(texto);
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

function isEliminado(eliminado) {
  return eliminado ? "Sim" : "Não";
}

server.listen(port, () => console.log(`Server listening on port: ${port}`));
