var http = require('http');
var express = require('express');

var Mcp3008 = require('mcp3008.js'),
    adc = new Mcp3008('/dev/spidev0.1'),
    channel = 0;

var app=express();

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

    return year + "/" + month + "/" + day + " " + hour + ":" + min + ":" + sec;

}

var inputs = [ { time: 'Temperature', value: 25.4 },
               { time: 'flow1', value: 100 } ];

app.use(express['static'](__dirname));

app.get('/inputs/:id', function(req, res) {
    res.status(200).send(inputs[req.params.id]);
});

app.get('*', function(req, res) {
    res.status(404).send('Unrecognised API call');
});


app.use(function(err, req, res, next) {
    if (req.xhr) {
        res.status(500).send('Oops, something went wrong!');
    } else {
        next(err);
    }
});

app.listen(80);
console.log('App running at port 80');

adc.poll(channel, 100, function(value) {
    var res, temp;
    res = (1023 / value) - 1;
    res = 10000 / res;
    temp = (res / 10000) ;
    temp = Math.log(temp);
    temp = temp / 3950;
    temp = temp + 1 / (25 + 273.15);
    temp = 1 / temp;
    temp = temp - 273.15;
    inputs[0].value = (Math.round(temp*100)/100).toString();
    inputs[0].time = getDateTime();
});
