const fetch = require('node-fetch');
const getInfo = (request, response) => {
    const url = "https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol=IBM&apikey=7TOGNX0K59HTDC9C"
    let data = "wow";
    fetch(url)
        .then(res => res.json())
        .then(body => { return response.json({ data: body }) });
    
};

module.exports.getInfo = getInfo;