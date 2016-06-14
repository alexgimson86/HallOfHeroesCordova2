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
    deviceRegistered : false,
   // marker: null,
    // Application Constructor
    initialize: function () {
        this.bindEvents();
    },

    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function () {
        //get current location
        window.setInterval(function () {
            navigator.geolocation.getCurrentPosition(app.onSuccess, app.onError);
            updateLatLongModule.callUpdateFunction();
            //alert(app.marker.position);
        }, 10000);
        navigator.geolocation.getCurrentPosition(app.onInitialSuccess, app.onError);

        if (app.deviceRegistered === false) {
            window.plugins.PushbotsPlugin.initialize("5758e8cd4a9efa067f8b4567", { "android": { "sender_id": "625558343336" } });

            window.plugins.PushbotsPlugin.on("notification:received", function (data) {
                console.log("received:" + JSON.stringify(data));
            });

            // Should be called once the notification is clicked
            window.plugins.PushbotsPlugin.on("notification:clicked", function (data) {
                console.log("clicked:" + JSON.stringify(data));
            });
            // Should be called once the device is registered successfully with Apple or Google servers
            window.plugins.PushbotsPlugin.on("registered", function (token) {
                app.deviceRegistered = true;
                console.log(token);
            });

            window.plugins.PushbotsPlugin.getRegistrationId(function (token) {
                console.log("Registration Id:" + token);
            });
        }
    },
    onSuccess: function(position){
        var longitude = position.coords.longitude;
        var latitude = position.coords.latitude;
        var latLong = new google.maps.LatLng(latitude, longitude);
        sessionStorage.setItem("latitude", latitude);
        sessionStorage.setItem("longitude", longitude);
        //alert("latitude: " + latitude + "longitude: " + longitude);
    },
    onInitialSuccess: function(position){
        var longitude = position.coords.longitude;
        var latitude = position.coords.latitude;
        var latLong = new google.maps.LatLng(latitude, longitude);
        sessionStorage.setItem("latitude", latitude);
        sessionStorage.setItem("longitude", longitude);
       // alert("latitude: " + latitude + "longitude: " + longitude);

        var mapOptions = {
            center: latLong,
            zoom: 16,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        var map = new google.maps.Map(document.getElementById("geolocation"), mapOptions);
        map.setCenter(latLong);
        var marker = new google.maps.Marker({
            position: latLong,
            map: map,
            title: 'your location'
        });
        app.marker = marker;
    },

    onError: function (error) {
        alert('code: ' + error.code + '\n' + 'message: ' + error.message);
    }
    // Update DOM on a Received Event
};
