var watson = require('watson-developer-cloud');

require('dotenv').config();

const { API_KEY, URL } = process.env;

const assistant = new watson.AssistantV1({
  iam_apikey: API_KEY,
  version: '2019-08-16',
  url: URL
});

module.exports = assistant;