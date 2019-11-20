const google = require('googleapis').google;
const customSearch = google.customsearch('v1');

require('dotenv').config();

const { API_KEY_GOOGLE, ID_ENGINE_SEARCH } = process.env;

async function search(question){
    const response = await customSearch.cse.list({
        auth: API_KEY_GOOGLE,
        cx: ID_ENGINE_SEARCH,
        q: question,
        num: 5
    });

    const { items } = response.data;

    if(items == undefined){
        const data = [{
            title: 'Not Found',
            link: 'https://www.google.com/',
            desc: 'Not Found'
          }]
        return data;
    }

    const result =  items.map((item)=> {
        return { title: item.title, link: item.link, desc: item.snippet }
    });

    return result;
}

module.exports = search;