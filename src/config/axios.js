const axios = require('axios');
const keys = require('./keys');

const instance = axios.create({
  baseURL: 'https://api.twitter.com/2/users/953378142198161409/tweets',
  timeout: 1000,
  headers: {'Authorization': `Bearer ${keys.twitter.bearer_token}`}
});

module.exports = instance;
