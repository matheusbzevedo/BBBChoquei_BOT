require('dotenv').config();

module.exports = {
  telegram: {
    token: process.env.TELEGRAM_BOT_TOKEN
  },
  twitter: {
    api_key: process.env.TWITTER_BOT_API_KEY,
    api_secret: process.env.TWITTER_BOT_API_SECRET,
    access_token: process.env.TWITTER_BOT_ACCESS_TOKEN,
    token_secret: process.env.TWITTER_BOT_TOKEN_SECRET,
    client_id: process.env.TWITTER_BOT_CLIENT_ID,
    client_secret: process.env.TWITTER_BOT_CLIENT_SECRET,
    bearer_token: process.env.TWITTER_BOT_BEARER_TOKEN,
    id_choquei: process.env.TWITTER_ID_CHOQUEI
  }
};
