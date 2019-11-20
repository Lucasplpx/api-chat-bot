const chatbot = require('../config/watson-bot');
const nlu = require('../services/watson-nlu');
const search = require('../services/google-search');

module.exports = {

    mensagem(req, res) {
        chatbot.sendMessage(req, async function (err, data) {
            if (err) {
                console.log("Error in sending message: ", err);
                return res.status(err.code || 500).json(err);
            }
            else {
                if(data.intents[0]){               
                    if (data.intents[0].intent == 'pesquisa') {
                        const text = removerAcentos(data.input.text.toLowerCase().split('bot').join('').trim());
                        const keywords = await palavraschaves(text);
                        const question = keywords.join(' ');
                        const result = await search(question);                        

                        return res.status(200).json({conteudo: result});
                    }
                }

                return res.status(200).json(data);
            }
        });
    },
}


async function palavraschaves(sentence) {

    try {
        const resp = await nlu(sentence);
        return resp;
    } catch (error) {
        console.log('error', error);
        return 'error';
    }

}

function removerAcentos(str) {
    const RegExp = /[''\,-]/g;
    const string = str.replace(RegExp, "").trim();
    return string;
}