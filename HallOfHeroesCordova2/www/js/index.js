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
    saveLocationInterval : null,
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
        //get current location
       app.saveLocationInterval =  window.setInterval(function () {
            navigator.geolocation.getCurrentPosition(app.onSuccess, app.onError);
            updateLatLongModule.callUpdateFunction();
            //alert(app.marker.position);
        }, 10000);
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
            if (data.message.indexOf("green") <= -1 && data.message.indexOf("yellow") <= -1 && data.message.indexOf("red") <= -1) {
                if (window.confirm(data.message + "\n\n" + "Do you want to reply ?")) {

                }
            }
        });
        // Should be called once the notification is clicked
        window.plugins.PushbotsPlugin.on("notification:clicked", function (data) {
            if (data.message.indexOf("green") > -1 || data.message.indexOf("yellow") > -1 || data.message.indexOf("red") > -1) {
                if (window.confirm("do you want to accept this call?")) {
                    var name = data.message.split(" ");
                    var lastName = name[name.length - 1];
                    var firstName = name[name.length - 2];
                    lastName = lastName.substr(0, lastName.length - 1);
                    alert(firstName + ' ' + lastName);
                    //testAjax();
                    /*$.ajax({
                        type: "GET",
                        url: "http://www.hallofheroesapp.com/php/checkIfCallValid.php",
                        data: {
                            lastName: lastName,
                            firstName: firstName
                        },
                        success: function (response) {
                            alert("in success");
                            alert(response);
                            getClosestHeroes(response);
                        },
                        error: function (response) {
                            alert("Error:" + response);
                        }
                    });*/


                    sessionStorage.setItem('callerFname', firstName);
                    sessionStorage.setItem('callerLname', lastName);
                    if (data.message.indexOf("green") > -1) {
                        window.location = "heroGreen.html";
                    }
                    else if (data.message.indexOf("yellow") > -1) {
                        window.location = "yellow.html";
                    }
                    else if (data.message.indexOf("red") > -1) {
                        window.location = "red.html";
                    }
                    else
                        alert("message just aint right");
                }
            }
        });
    },
    onSuccess: function(position){
        var longitude = position.coords.longitude;
        var latitude = position.coords.latitude;
        var latLong = new google.maps.LatLng(latitude, longitude);
        sessionStorage.setItem("latitude", latitude);
        sessionStorage.setItem("longitude", longitude);

        /*var mapOptions = {
            center: latLong,
            zoom: 16,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };*/
        //var map = new google.maps.Map(document.getElementById("geolocation"), mapOptions);
        /*if (app.marker) {
            app.marker.setPosition(latLong);
            app.map.setCenter(latLong);
        }*/
        /*if (app.marker) {
            app.marker.setCenter(latLong);
        }*/
        //alert("latitude: " + latitude + "longitude: " + longitude);
    },
    onInitialSuccess: function(position){
        var longitude = position.coords.longitude;
        var latitude = position.coords.latitude;
        var latLong = new google.maps.LatLng(latitude, longitude);
        sessionStorage.setItem("latitude", latitude);
        sessionStorage.setItem("longitude", longitude);
        //alert("latitude: " + latitude + "longitude: " + longitude);
            
        var mapOptions = {
            center: latLong,
            zoom: 16,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        if (google) {
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
        }
        app.marker = marker;
        if (app.markerTwo === null) {
            if (app.marker) {
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
                        navigator.geolocation.clearWatch(watchID);
                    }
                    //app.map.panTo(app.marker.getPosition());
                });
            }
        }
    },

    onError: function (error) {
        alert('code: ' + error.code + '\n' + 'message: ' + error.message);
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
 /*           var url;
            var isValid = 0;
            alert(response);
            response.forEach(function (callerInfo, i) {
                if (callerInfo.pendingCall == 1) {
                    url = callerInfo.avatarUrl;
                    isValid = 1;
                }
            });
            if (isValid === 1) 
                jQuery('#heroAvatar').prepend('<img src="' + url + '"  style="width: auto; height: auto;max-width: 100px;max-height: 100px"/></div>');
            else {
                alert("sorry but this caller has already been helped.");
                window.location = "home.html";
            }
        */},
        error: function (response) {
            alert("Error:" + response);
        }
    });
}