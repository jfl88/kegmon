'use strict';

var Mcp3008 = require('mcp3008.js'),
    adc = new Mcp3008('/dev/spidev0.1'),
    channel = 0;

adc.poll(channel, 1000, function(value) {
    var res, temp;
    res = (1023 / value) - 1;
    res = 10000 / res;
    temp = res / 10000;
    temp = Math.log(temp);
    temp = temp / 3950;
    temp = temp + 1 / (25 + 273.15);
    temp = 1 / temp;
    temp = temp - 273.15;
    console.log("temperature is: " + Math.round(temp*100)/100 + "*C");
});
