function getCallerLocation(firstName, lastName) {
    var hasLoaded = sessionStorage.getItem('hasLoaded');
    if (hasLoaded == 0) {
        $.ajax({
            type: "GET",
            url: "http://www.hallofheroesapp.com/php/getCallerLocation.php",
            data: {
                lastName: lastName,
                firstName: firstName
            },
            dataType: "json",
            success: function (data) {
                var latitude = data[0].latitude;
                var longitude = data[0].longitude;
                sessionStorage.setItem('callerLat', latitude);
                sessionStorage.setItem('callerLong', longitude);
                var callersPushToken = data[0].pushToken;
                sessionStorage.setItem('callersPushToken', callersPushToken);
                var callerInfo = {
                    latitude: latitude,
                    longitude: longitude,
                    firstName: firstName,
                    lastName: lastName
                }
                setIfCallPending(callerInfo);

            },
            error: function (error) {
                var msg = $.parseJSON(error).msg;
                alert(msg);

            }
        });
    }
    else {
        var lat = sessionStorage.getItem('callerLat');
        var long = sessionStorage.getItem('callerLong');
        alert(lat, long);
        setTimeout(function () {
            dropMarker(lat, long);
        }, 5000);
    }
}
function setIfCallPending(callerInfo) {
    $.ajax({
        type: "POST",
        url: "http://www.hallofheroesapp.com/php/setIfCallPending.php",
        data: {
            latitude: callerInfo.latitude,
            longitude: callerInfo.longitude,
            isPending: 0,
            lastName: callerInfo.lastName,
            firstName: callerInfo.firstName
        },
        dataType: "json",
        success: function (data) {
            setTimeout(function () {
                dropMarker(callerInfo.latitude, callerInfo.longitude);
            }, 5000);
        },
        error: function (error) {
            var msg = $.parseJSON(error).msg;
            alert(msg);

        }
    });
}
function getHeroLocation() {
    $.ajax({
        type: "GET",
        url: "http://www.hallofheroesapp.com/php/getHeroLatAndLong.php",
        dataType: "json",
        success: function (data) {
            var latitude = data.latitude;
            var longitude = data.longitude;
            $('#heroName').html(data.firstName + ' ' + data.lastName + ' ' + 'is on the way!');
            sessionStorage.setItem('heroFirstName', data.firstName);
            sessionStorage.setItem('heroLastName', data.lastName);
            sessionStorage.setItem('pushToken', data.pushToken);
            setTimeout(function () {
                dropMarker(latitude, longitude);
            }, 5000);
        },
        error: function (error) {
            alert("in error");
            var msg = $.parseJSON(error).msg;
            alert(msg);

        }
    });
}
function dropMarker(latitude,longitude)
{
    var callersMarker;
    var latLong2 = new google.maps.LatLng(latitude, longitude);

    callersMarker = new google.maps.Marker({
        position: latLong2,
        map: app.map,
        title: 'Caller Location'
    });
    app.markerTwo = callersMarker;

    var directionsDisplay;
    var directionsService = new google.maps.DirectionsService();
    directionsDisplay = new google.maps.DirectionsRenderer();
    directionsDisplay.setMap(app.map);

    calcRoute(directionsDisplay, directionsService,latLong2);
}
function initialize(directionsDisplay) {
    directionsDisplay = new google.maps.DirectionsRenderer();
    directionsDisplay.setMap(app.map);
}
function calcRoute(directionsDisplay, directionsService,latLong2) {
   
    var request = {
        origin: app.marker.position,
        destination: latLong2,
        travelMode: google.maps.TravelMode.DRIVING
    };
    directionsService.route(request, function (result, status) {
        if (status == google.maps.DirectionsStatus.OK) {
            directionsDisplay.setDirections(result);
        }
    });
    app.marker.setMap(null);
    app.markerTwo.setMap(null);
}