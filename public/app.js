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

    angular
        .module('app', ['firebase'])
        .controller('Controller', function ($firebaseObject) {

            const database = firebase.database().ref();

            this.object = $firebaseObject(database);

            //Create reference to Smart-Fan status
            const statusRef = database.child('status');
            const dataRef = database.child('data');


            //Syn status changes (eventType, callback)
            statusRef.on('value', snap =>
                console.log(snap.val()));

            //Sync Data Changes
            dataRef.on('child_added', snap => {
                console.log(snap.val());
            });
        });

}());
