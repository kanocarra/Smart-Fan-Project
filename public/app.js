/**
 * Created by kanocarra on 14/08/16.
 */
var statusRef;

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
            const dataRef = database.child('data');

            //$('#updateSpeed').click(function(e) {
            //    e.preventDefault();
            //    console.log($('#exampleSpeed').val());
            //    statusRef.update({
            //        "speed": $('#exampleSpeed').val()
            //    });
            //});

            //Sync Data Changes
            dataRef.on('value', snap => drawGraphs(snap.val()));

            statusRef.on('value', snap => updateStats(snap.val()));


}());

function drawGraphs(data) {


    var speedValues = [];
    var powerValues = [];
    var tempValues = [];
    var dateTime = [];

    for (var value in data) {
        speedValues.push(data[value]['speed']);
        powerValues.push(data[value]['power']);
        tempValues.push(data[value]['temperature']);
        var date = new Date(parseInt(value));
        var time =  date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
        dateTime.push(time);
    }

    drawSpeedGraph(speedValues, dateTime);
    drawPowerGraph(powerValues, dateTime);
    drawTemperatureGraph(tempValues, dateTime);
}


function drawSpeedGraph(speedValues, dateTime){

    var ctx = document.getElementById("speedChart");
    var myChart = new Chart(ctx, {
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
            //title: {
            //    display: true,
            //    position: top,
            //    fontSize: 12,
            //    text: 'Speed (RPM)'
            //},
            legend: {
                display: false
            }
        }
    });
}

function drawPowerGraph(powerValues,dateTime){
    var ctx = document.getElementById("powerChart");
    var myChart = new Chart(ctx, {
        type: 'line',
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
            //title: {
            //    display: true,
            //    position: top,
            //    fontSize: 12,
            //    text: 'Power Usage (W)'
            //},
            legend: {
                display: false
            }
        }
    });

}

function drawTemperatureGraph(tempValues,dateTime){

    var ctx = document.getElementById("temperatureChart");
    var myChart = new Chart(ctx, {
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
            }
        }
    });

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

    $('#current-speed').html('<h2 style= "color: white" class="card-text">' + statusData['speed'] + ' RPM</h2>');

    $('#power-usage').html('<h2 style= "color: white" class="card-text">' + statusData['power'] + ' W</h2>')

    $('#fan-details').html( '<p><bold>Device Type:</bold> '+ statusData['deviceParam'] + ' ' + statusData['deviceType'] + '</p>' +
                            '<p><bold>Device ID:</bold> ' + statusData['deviceId'] + '</p>' +
                            '<p><bold>Software Version:</bold> ' + statusData['softwareVersion'] +  '</p>');
}


$( document ).ready( function() {
    $("#updateSpeed").on("click", function (e) {
        e.preventDefault();
        var newSpeed = $('#exampleSpeed').val();
        if(newSpeed != ""){
        statusRef.update({
            "speed": $('#exampleSpeed').val()
        });
        }

    });

    $('#fanState').on('click', function(){
        var currentState = $('#fanState').text();
        if(currentState.indexOf("Start") != -1){
            statusRef.update({
                "state": "O"
            });
        } else {
            statusRef.update({
                "state": "X"
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
