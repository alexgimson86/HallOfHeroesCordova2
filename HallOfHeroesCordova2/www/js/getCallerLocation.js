function getCallerLocation(firstName, lastName) {
    alert("entering get caller location");
    $.ajax({
        type: "GET",
        url: "http://www.hallofheroesapp.com/php/getCallerLocation.php",
        data: {
            lastName: lastName,
            firstName: firstName
        },
        dataType: "json",
        success: function (data) {
            alert("in success of getCallerLocation " + data);
            var latitude = data[0].latitude;
            var longitude = data[0].longitude;
            var callerInfo = {
                latitude: latitude,
                longitude: longitude,
                firstName: firstName,
                lastName : lastName
            }
            setIfCallPending(callerInfo);
           
        },
        error: function (error) {
            alert("in error of getcallerlocation error: " + error);
            var msg = $.parseJSON(error).msg;
            alert(msg);

        }
    });
}
function setIfCallPending(callerInfo) {
    
    alert("entering setifcallpending" + callerInfo.latitude + callerInfo.longitude);
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
            alert("in success of setifCallpending data:" + data);
            dropMarker(callerInfo.latitude, callerInfo.longitude);
        },
        error: function (error) {
            alert("in error of setifcallpending " + error);
            var msg = $.parseJSON(error).msg;
            alert(msg);

        }
    });
}
function getHeroLocation() {
    alert("in hero location function");
    $.ajax({
        type: "GET",
        url: "http://www.hallofheroesapp.com/php/getHeroLatAndLong.php",
        dataType: "json",
        success: function (data) {
            var latitude = data.latitude;
            var longitude = data.longitude;
            $('#heroName').html(data.firstName + ' ' + data.lastName + ' ' + 'is on the way!');
            sessionStorage.setItem('pushToken', data.pushToken);
            dropMarker(latitude, longitude);
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