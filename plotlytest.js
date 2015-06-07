var Mcp3008 = require('mcp3008.js'),
    adc = new Mcp3008('/dev/spidev0.1'),
    channel = 0;

function getDateTime() {

    var date = new Date();

    var hour = date.getHours();
    hour = (hour < 10 ? "0" : "") + hour;

    var min  = date.getMinutes();
    min = (min < 10 ? "0" : "") + min;

    var sec  = date.getSeconds();
    sec = (sec < 10 ? "0" : "") + sec;

    var year = date.getFullYear();

    var month = date.getMonth() + 1;
    month = (month < 10 ? "0" : "") + month;

    var day  = date.getDate();
    day = (day < 10 ? "0" : "") + day;

    return year + "-" + month + "-" + day + " " + hour + ":" + min + ":" + sec;
}

var inputs = [], inputIdx = 0;

var config = require('./config.json')
    , username = config['user']
    , apiKey = config['apiKey']
    , token = config['token']
    , Plotly = require('plotly')(username, apiKey);

var data = {
    'x': [],
    'y': [],
    'type':'scatter',
    'mode':'lines',
    'stream': {
        'token': 'gx2dki2d1z'
    }
}

var graphOptions = {
    "filename": "tempTest",
    "fileopt": "extend",
    "layout": {
        "title": "streaming temp sensor data"
    },
    "world_readable": true
}

adc.poll(channel, 100, function(value) {
    inputs[inputIdx] = value;
    if (inputIdx < 20) {
        inputIdx++;
    } else {
        inputIdx = 0;
    }
});

setInterval(function() {
    var avg = 0, res, temp;
    for (i = 0; i < inputs.length; i++) {
        avg += inputs[i];
    }
    avg /= inputs.length;

    res = (1023 / avg) - 1;
    res = 10000 / res;
    temp = (res / 10000) ;
    temp = Math.log(temp);
    temp = temp / 3950;
    temp = temp + 1 / (25 + 273.15);
    temp = 1 / temp;
    temp = temp - 273.15;

    data.y = (Math.round(temp*100)/100).toString();
    data.x = getDateTime();

    Plotly.plot(data, graphOptions, function (err, resp) {
        if (err) return console.log("ERROR: ", err);
        console.log(data.x);
        console.log(resp);
    });
}, 60000);
