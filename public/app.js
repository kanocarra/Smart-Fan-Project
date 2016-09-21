/**
 * Created by kanocarra on 14/08/16.
 */
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
            const statusRef = database.child('status');
            const dataRef = database.child('data');

            //drawGraph(dataRef.val());

            //Syn status changes (eventType, callback)
            //statusRef.on('value', snap =>
            //    console.log(snap.val())
            //);
            //Sync Data Changes
            dataRef.on('value', snap => drawGraphs(snap.val()));
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
            title: {
                display: true,
                position: top,
                fontSize: 12,
                text: 'Speed (RPM)'
            },
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
            title: {
                display: true,
                position: top,
                fontSize: 12,
                text: 'Power Usage (W)'
            },
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
            title: {
                display: true,
                position: top,
                fontSize: 12,
                text: 'Temperature of Fan (Celcius)'
            },
            legend: {
                display: false
            }
        }
    });

}

