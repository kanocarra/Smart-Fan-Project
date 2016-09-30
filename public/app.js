/**
 * Created by kanocarra on 14/08/16.
 */
var statusRef;
var speedGraph;
var powerGraph;
var temperatureGraph;
var graphDrawn;
var dataRef;
var timer;
var speedValues = [];
var powerValues = [];
var tempValues = [];
var dateTime = [];

(function() {

    // Initialize Firebase
    var config = {
        apiKey: "AIzaSyBmK3pKvRq8TkgVWZXOgouVRD5YdzWzgzA",
        authDomain: "smart-fan-project.firebaseapp.com",
        databaseURL: "https://smart-fan-project.firebaseio.com",
        storageBucket: "smart-fan-project.appspot.com",
    };
    firebase.initializeApp(config);

            const database = firebase.database().ref();

            //Create reference to Smart-Fan status
            statusRef = database.child('status');
            dataRef = database.child('data');
            graphDrawn = false;
            dataCount = 0;

            dataRef.limitToLast(20).on('child_added', function(snap) {
                if(graphDrawn){
                    updateGraphs(snap.val());
                } else {
                    drawGraphs(snap.val());
                }

            });

            statusRef.on('value', snap => updateStats(snap.val()));


}());

function requestStatus() {
    console.log("timeout");
    statusRef.update({
        "statusRequested": "1"
    });
}

function drawGraphs(data) {

    if(dataCount < 19){
        speedValues.push(data['speed']);
        tempValues.push(data['temperature']);
        powerValues.push(data['power']);

        var date = new Date(parseInt(data['timestamp']));
        var time =  date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
        dateTime.push(time);

        dataCount++;
    } else {
        speedValues.push(data['speed']);
        tempValues.push(data['temperature']);
        powerValues.push(data['power']);

        var date = new Date(parseInt(data['timestamp']));
        var time =  date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
        dateTime.push(time);

        drawSpeedGraph(speedValues, dateTime);
        drawPowerGraph(powerValues, dateTime);
        drawTemperatureGraph(tempValues, dateTime);
        graphDrawn = true;

    }

    //for (var value in data) {
    //    speedValues.push(data[value]['speed']);
    //    powerValues.push(data[value]['power']);
    //    tempValues.push(data[value]['temperature']);
    //    var date = new Date(parseInt(value));
    //    var time =  date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
    //    dateTime.push(time);
    //}



}

function updateGraphs(data) {
    var speed = data['speed'];
    var power = data['power'];
    var temperature = data['temperature'];
    var timestamp = data['timestamp'];
    var date = new Date(parseInt(timestamp));
    var time =  date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();

    console.log(data);

    // Update speed chart
    speedGraph.data.datasets[0].data.shift();
    speedGraph.data.labels.shift();

    speedGraph.data.datasets[0].data.push(speed);
    speedGraph.data.labels.push(time);

    speedGraph.update();


    // Update power chart
    powerGraph.data.datasets[0].data.shift();
    powerGraph.data.labels.shift();

    powerGraph.data.datasets[0].data.push(power);
    powerGraph.data.labels.push(time);

    powerGraph.update();

    // Update temperature chart
    temperatureGraph.data.datasets[0].data.shift();
    temperatureGraph.data.labels.shift();

    temperatureGraph.data.datasets[0].data.push(temperature);
    temperatureGraph.data.labels.push(time);

    temperatureGraph.update();


}


function drawSpeedGraph(speedValues, dateTime){

    var ctx = document.getElementById("speedChart");
    speedGraph = new Chart(ctx, {
        type: 'line',
        data: {
            labels: dateTime,
            datasets: [{
                data: speedValues,
                backgroundColor: 'rgba(0,172,172,0.3)',
                borderColor: '#00acac',
                borderWidth: 5
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            },
            legend: {
                display: false
            },
            tooltips: {
                enabled: true,
                mode: 'single',
                callbacks: {
                    label: function(tooltipItems, data) {
                        return tooltipItems.yLabel + ' RPM';
                    }
                }
            }
        }


    });
}

function drawPowerGraph(powerValues,dateTime){
    var ctx = document.getElementById("powerChart");
    powerGraph = new Chart(ctx, {
        type: 'line',
        multiTooltipTemplate: '<%%= value %>',
        data: {
            labels: dateTime,
            datasets: [{
                data: powerValues,
                backgroundColor: 'rgba(114, 124, 182, 0.3)',
                borderColor:'#727cb6',
                borderWidth: 5
            }]
        },
        options: {

            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            },
            legend: {
                display: false
            },
            tooltips: {
                enabled: true,
                mode: 'single',
                callbacks: {
                    label: function(tooltipItems, data) {
                        return tooltipItems.yLabel + ' W';
                    }
                }
            }
        }
    });

}

function drawTemperatureGraph(tempValues,dateTime){

    var ctx = document.getElementById("temperatureChart");
    temperatureGraph = new Chart(ctx, {
        type: 'line',
        data: {
            labels: dateTime,
            datasets: [{
                data: tempValues,
                backgroundColor: 'rgba(52,143,226,0.3)',
                borderColor: '#348fe2',
                borderWidth: 5
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            },
            //title: {
            //    display: true,
            //    position: top,
            //    fontSize: 12,
            //    text: 'Temperature of Fan (Celcius)'
            //},
            legend: {
                display: false
            },
            tooltips: {
                enabled: true,
                mode: 'single',
                callbacks: {
                    label: function(tooltipItems, data) {
                        return tooltipItems.yLabel + '°C';
                    }
                }
            }
        }
    });
    graphDrawn = true;

}

function updateStats(statusData){

    var status;

    if(statusData['state'] == 'O'){
        status = 'ON';
        $('#fan-status').css({
            'background-color' : 'green',
            'text-align' : 'center'
        });
    } else if(statusData['state'] == 'X'){
        status = 'OFF';
        $('#fan-status').css({
            'background-color' : 'grey',
            'text-align' : 'center'
        });
    } else if (statusData['state'] == 'L') {
        status = 'LOCKED';
        $('#fan-status').css({
            'background-color' : 'red',
            'text-align' : 'center'
        });
    } else if (statusData['state'] == 'B'){
        status = 'BLOCKED';
        $('#fan-status').css({
            'background-color' : '#ffbb01',
            'text-align' : 'center'
        });
    }

    $('#fan-status').html('<h2 style= "color: white" class="card-text">' + status + '</h2>');

    if(status == 'ON'){
        $('#fanState').text("Stop Fan");
    } else {
        $('#fanState').text("Start Fan");
    }

    $('#current-speed').html('<h2 style= "color: white" class="card-text">' + statusData['currentSpeed'] + ' RPM</h2>');

    $('#power-usage').html('<h2 style= "color: white" class="card-text">' + statusData['power'] + ' W</h2>')

    $('#fan-details').html( '<p><bold>Device Type:</bold> '+ statusData['deviceParam'] + ' ' + statusData['deviceType'] + '</p>' +
                            '<p><bold>Device ID:</bold> ' + statusData['deviceId'] + '</p>' +
                            '<p><bold>Software Version:</bold> ' + statusData['softwareVersion'] +  '</p>');
}


$( document ).ready( function() {

    $("#updateSpeed").on("click", function (e) {
        e.preventDefault();
        $('#updateSpeed').text('');
        var newSpeed = $('#exampleSpeed').val();
        if(newSpeed != ""){
            if(parseInt(newSpeed) <= 0){
                statusRef.update({
                    "requestedSpeed": "0",
                    "state": "X"
                });
            }
        statusRef.update({
            "requestedSpeed": $('#exampleSpeed').val()
        });
        }

    });

    $('#fanState').on('click', function(){
        var currentState = $('#fanState').text();
        if(currentState.indexOf("Start") != -1){
            timer = setInterval(requestStatus, 1000);
            statusRef.update({
                "state": "O"
            });
        } else {
            clearInterval(timer);
            statusRef.update({
                "state": "X",
                "requestedSpeed": "0"
            });
        }
    });

    $('#calibrateFan').on('click', function() {
        statusRef.update({
            "calibrateFan": "1"
        });
    });

    $('#requestStatus').on('click', function() {
        statusRef.update({
            "statusRequested": "1"
        });
    });

});
