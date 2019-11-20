const NaturalLanguageUnderstandingV1 = require('ibm-watson/natural-language-understanding/v1');
const { IamAuthenticator } = require('ibm-watson/auth');

require('dotenv').config();

const { API_KEY_NLU, URL_NLU } = process.env;

const nlu = new NaturalLanguageUnderstandingV1({
  version: '2019-07-12',
  authenticator: new IamAuthenticator({
    apikey: API_KEY_NLU,
  }),
  url: URL_NLU,
});


async function fetchWatsonAndReturnKeywords(sentence){
    return new Promise((resolve, reject) => {
      const params = {
        text: sentence,
        features: {
          keywords: {}
        }
      }
      
      nlu.analyze(params)
        .then(resp => {
          const keywords = resp.result.keywords.map((keyword) => {
            return keyword.text;
          });
          resolve(keywords);
        })
        .catch(err => {
          console.log('error watson-nlu:', err);
        });
    });
  }
  

module.exports = fetchWatsonAndReturnKeywords;