const assistant = require('../services/watson');
require('dotenv').config();

const { WORKSPACE_ID } = process.env;

var chatbot = {
    sendMessage: function (req, callback) {
        buildContextObject(req, function (err, params) {
            if (err) {
                console.log("Error in building the parameters object: ", err);
                return callback(err);
            }
            if (params.message) {
                var conv = req.body.context.conversation_id;
                var context = req.body.context;
                var res = {
                    intents: []
                    , entities: []
                    , input: req.body.text
                    , output: {
                        text: params.message
                    }
                    , context: context
                };
          
                callback(null, res);
            
            }
            else if (params) {
                // Send message to the watson assistant service with the current context
                assistant.message(params, function (err, data) {               
                    if (err) {                       
                        return callback(err);
                    } else {                 
                        return callback(null, data);

                    }
                });
            }
        });
    }
};

/**
 * @summary Form the parameter object to be sent to the service
 *
 * Update the context object based on the user state in the watson assistant and
 * the existence of variables.
 *
 * @function buildContextObject
 * @param {Object} req - Req by user sent in POST with session and user message
 */
function buildContextObject(req, callback) {
    var message = req.body.text;
    
    var context;
    if (!message) {
        message = '';
    }
    
    var params = {
        workspace_id: WORKSPACE_ID
        , input: {}
        , context: {}
    };


    if (req.body.context) {
        context = req.body.context;
        params.context = context;
    }
    else {
        context = '';
    }
    
    params.input = {
        text: message 
    };
    
    return callback(null, params);
}

module.exports = chatbot;