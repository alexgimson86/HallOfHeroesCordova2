var updateLatLongModule = (function ($) {

    //public
    var callUpdateFunction = function (callback) {
        var latitude = sessionStorage.getItem('latitude');
        var longitude = sessionStorage.getItem('longitude');
        updateLocation(latitude, longitude, callback);

    }
    //private
    var updateLocation = function (latitude,longitude,callback) {
        
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
                if (callback) {
                    callback();
                }
             // alert("updated location with latitude " + latitude + " and longitude " + longitude + ".");
            },
            error: function (response) {
              alert("Error updating location");
            }
        });
    }
    return {
        callUpdateFunction: callUpdateFunction
    }

}(jQuery));