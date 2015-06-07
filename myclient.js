setInterval(function() {
    var updateString = '';
    url = document.URL + 'inputs/' + 0;
    jqhxr = $.getJSON(url, function(data) {
        console.log('API response received');
        updateString += '<p>' + data['time'] + ' : ' + data['value'] + '&deg;C</p>';
        $('#input').html(updateString);
    });
}, 1000);
