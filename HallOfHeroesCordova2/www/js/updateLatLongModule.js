var updateLatLongModule = (function ($) {

    //public
    var callUpdateFunction = function () {
        var latitude = sessionStorage.getItem('latitude');
        var longitude = sessionStorage.getItem('longitude');
        updateLocation(latitude,longitude)

    }
    //private
    var updateLocation = function (latitude,longitude) {
        
        var userId = 1;
        $.ajax({
            type: "POST",
            url: "http://www.hallofheroesapp.com/php/updateLocation.php",
            dataType: "json",
            data: {
                userId: userId,
                latitude: latitude,
                longitude: longitude
            },
            success: function (response) {
               // alert("updated location with latitude " + latitude + " and longitude " + longitude + ".");
            },
            error: function (response) {
             //   alert("Error:" + response);
            }
        });
    }
    return {
        callUpdateFunction: callUpdateFunction
    }

}(jQuery));