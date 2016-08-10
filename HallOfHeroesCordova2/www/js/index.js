/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    map : null,
    initCheck : sessionStorage.getItem("initializationCheck"),
    marker: null,
    markerTwo: null,
    saveLocationInterval: null,
    saveLocationIntervalHero: null,
    // Application Constructor
    initialize: function () {
        this.bindEvents();
    },

    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function () {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function () {
        //get current location if you arent hero 
        //will get location less frequently to save battery
        if (sessionStorage.getItem('isHero') == 0) {
            app.saveLocationInterval = window.setInterval(function () {
                //call every few seconds to update the users location
                navigator.geolocation.getCurrentPosition(app.onSuccess, app.onError);
            }, 10000);
        }

        //if you are hero we get location more frequently and update more frequently
        //to give a better more accurate marker
        else {
            //clearInterval(app.saveLocationInterval);
            app.saveLocationIntervalHero = window.setInterval(function () {
                //call every few seconds to update the users location

                recursiveGetCoordinates({latitude: 0, longitude: 0,count:10});
                //navigator.geolocation.getCurrentPosition(app.onSuccess, ap p.onError);
            }, 5000);
        }
        navigator.geolocation.getCurrentPosition(app.onInitialSuccess, app.onError);

        //if (app.initCheck === "0") {
        window.plugins.PushbotsPlugin.initialize("5758e8cd4a9efa067f8b4567", { "android": { "sender_id": "625558343336" } });

        // Should be called once the device is registered successfully with Apple or Google servers
        window.plugins.PushbotsPlugin.on("registered", function (token) {
            app.deviceRegistered = true;
            alert(token);
            savePushRegistration(token);
        });

        window.plugins.PushbotsPlugin.getRegistrationId(function (token) {
            console.log("Registration Id:" + token);
        });
            
            //sessionStorage.setItem("initializationCheck", 1);
        //}
        window.plugins.PushbotsPlugin.on("notification:received", function (data) {
            if (data.message.indexOf("green call from") <= -1 && data.message.indexOf("yellow call from") <= -1 && data.message.indexOf("red call from") <= -1) {
                if (window.confirm(data.message + "\n\n" + "Do you want to reply ?")) {
                    var isHero = sessionStorage.getItem('isHero');
                    var isCaller = sessionStorage.getItem('isCaller');
                    if (isHero == 1)
                        window.location = 'messageFromHero.html';
                    else
                        window.location = 'messaging.html';
                }
            }
        });
        // Should be called once the notification is clicked
        window.plugins.PushbotsPlugin.on("notification:clicked", function (data) {
            if (data.message.indexOf("green call from") > -1 || data.message.indexOf("yellow call from") > -1 || data.message.indexOf("red call from") > -1) {
                if (window.confirm("do you want to accept this call?")) {
                    var name = data.message.split(" ");
                    var lastName = name[name.length - 1];
                    var firstName = name[name.length - 2];
                    lastName = lastName.substr(0, lastName.length - 1);

                    if (data.message.indexOf("green") > -1) {
                        sessionStorage.setItem('color', 'green');
                    }
                    if (data.message.indexOf("yellow") > -1) {
                        sessionStorage.setItem('color', 'yellow');
                    }
                    if (data.message.indexOf("red") > -1) {
                        sessionStorage.setItem('color', 'red');
                    }
                    sessionStorage.setItem('callerFname', firstName);
                    sessionStorage.setItem('callerLname', lastName);
                    window.location = "heroGreen.html";
                }
            }
        });
    },
    onSuccess: function (position) {
        var longitude = position.coords.longitude;
        var latitude = position.coords.latitude;
        sessionStorage.setItem("latitude", latitude);
        sessionStorage.setItem("longitude", longitude);
        updateLatLongModule.callUpdateFunction();
        if (app.marker) {
            var latLong = new google.maps.LatLng(latitude, longitude);
            app.marker.setPosition(latLong);
        }
    },
    onInitialSuccess: function(position){
        var longitude = position.coords.longitude;
        var latitude = position.coords.latitude;
        if (google) {
            var latLong = new google.maps.LatLng(latitude, longitude);
        }
        sessionStorage.setItem("latitude", latitude);
        sessionStorage.setItem("longitude", longitude);
            
        var mapOptions = {
            center: latLong,
            zoom: 16,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        if (sessionStorage.getItem('isMap')==1 || sessionStorage.getItem('isHero')==1 || sessionStorage.getItem('isCaller')==1) {
            app.map = new google.maps.Map(document.getElementById("geolocation"), mapOptions);
        }
        //app.map.setCenter(latLong);
        var marker;
        if (app.map) {
                marker = new google.maps.Marker({
                position: latLong,
                map: app.map,
                title: 'your location'
                });
                app.marker = marker;
        }
       // app.marker = marker;
        
        /*if (app.marker) {
            var watchID = navigator.geolocation.watchPosition(function (position) {
                app.marker.setPosition(
                    new google.maps.LatLng(
                        position.coords.latitude,
                        position.coords.longitude)
                );
                var latlng = new google.maps.LatLng(
                        position.coords.latitude,
                        position.coords.longitude);
                if (app.markerTwo === null) {
                    app.map.setCenter(latlng);
                }
                else {
                    //navigator.geolocation.clearWatch(watchID);
                }
                //app.map.panTo(app.marker.getPosition());
            });
        }*/
        //testing event
       if (sessionStorage.getItem('isCaller') == 1) {
            var listener = google.maps.event.addListenerOnce(app.map, 'tilesloaded', function (evt) {
                dropMarker(sessionStorage.getItem('heroLat'), sessionStorage.getItem('heroLong'));
                sessionStorage.setItem('callerListener', listener);
                sessionStorage.setItem('isLoadedCaller', 1);
            });
       }
       if (sessionStorage.getItem('isHero') == 1) {
           var listener = google.maps.event.addListenerOnce(app.map, 'tilesloaded', function (evt) {
               dropMarker(sessionStorage.getItem('callerLat'), sessionStorage.getItem('callerLong'));
               sessionStorage.setItem('heroListener', listener);
               sessionStorage.setItem('hasLoaded', 1);
           });
       }
    },

    onError: function (error) {
        //alert('code: ' + error.code + '\n' + 'message: ' + error.message);
    }
    // Update DOM on a Received Event
};
function testAjax(firstName, lastName) {
    $.ajax({
        type: "GET",
        url: "http://www.hallofheroesapp.com/php/checkIfCallValid.php",
        data: {
            lastName: lastName,
            firstName: firstName
        },
        dataType: "json",
        success: function (response) {
            var isValid = 0;
            response.forEach(function (callerInfo, i) {
                alert(callerInfo.pendingCall);
                if (callerInfo.pendingCall == 1) {
                    isValid = 1;
                }
            });
            if(isValid !=1) {
                alert("sorry but this caller has already been helped.");
                window.location = "home.html";
            }
        },
        error: function (response) {
          //  alert("Error:" + response);
        }
    });
}
//function is on an interval, is set when you are the hero.
//get an average of lat and long for the heroes coordinates to be
//more accurate 
function recursiveGetCoordinates(coordinatesAccumulator) {

    if (coordinatesAccumulator.count != 0) {
        navigator.geolocation.getCurrentPosition(function (position) {
            /* if they are the hero get latitude and longitude 10
            times and then take the average. To make it more accurate and 
            prevent the marker from jumping around so much */
            coordinatesAccumulator.latitude += position.coords.latitude;
            coordinatesAccumulator.longitude += position.coords.longitude;
            recursiveGetCoordinates({ latitude: coordinatesAccumulator.latitude, longitude: coordinatesAccumulator.longitude, count: --coordinatesAccumulator.count });
        }, app.onError);
    }
    else {
        coordinatesAccumulator.latitude = coordinatesAccumulator.latitude / 10;
        coordinatesAccumulator.longitude = coordinatesAccumulator.longitude / 10;
        sessionStorage.setItem("latitude", coordinatesAccumulator.latitude);
        sessionStorage.setItem("longitude", coordinatesAccumulator.longitude);

        updateLatLongModule.callUpdateFunction();
        if (app.marker) {
            var latLong = new google.maps.LatLng(coordinatesAccumulator.latitude, coordinatesAccumulator.longitude);
            app.marker.setPosition(latLong);
        }
        return;
    }
}
