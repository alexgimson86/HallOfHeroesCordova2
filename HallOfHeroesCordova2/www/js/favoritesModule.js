var favoritesModule = (function($){
    //private
    var favoritesArray = [];
    var createFavoriteHeroes =function(heroArray){
        var dist1, dist2, dist3;
        var count = 0;
        var latitude = sessionStorage.getItem('latitude');
        var longitude = sessionStorage.getItem('longitude');

        heroArray.forEach(function(dat){
            var dist = distance(dat.latitude, dat.longitude,latitude,longitude,"M");
            if (count === 0) {
                dist1 = dist;
                dist1 = dist1.toFixed(1);
            }
            if (count === 1) {
                dist2 = dist;
                dist2 = dist2.toFixed(1);
            }
            else {
                dist3 = dist;
                dist3 = dist3.toFixed(1);
            }
            count++;
        });

        heroArray.forEach(function (dat, i) {
            if (i === 0) {
                $('#favoriteHeroes')
                     .html('<div class="HH-hero" data-userId="' + dat.idUsers + '" data-pushToken="' + dat.pushToken + '"> \
                                <div class="plus-sign">\
                                    <img src="img/plus.png" alt="edit favorite hero" onClick="callContacts()" />\
                                </div>\
                                <div class="HH-people">\
                                    <img src="' + dat.avatarUrl + '" /> </div>\
                                <div class="HH-name"> \
                                    <h4>' + dat.firstName + ' ' + dat.lastName + '</h4>\
                                    <h5>' + dist1 + " miles" + '</h5>\
                                </div>\
                             </div>');
            }
            else if (i === 1) {
                $('#favoriteHeroes')
                     .append('<div class="HH-hero" data-userId="' + dat.idUsers + '" data-pushToken="' + dat.pushToken + '"> \
                                <div class="plus-sign">\
                                    <img src="img/plus.png" alt="edit favorite hero" onClick="callContacts()" />\
                                </div>\
                                <div class="HH-people">\
                                    <img src="' + dat.avatarUrl + '" /> </div>\
                                <div class="HH-name"> \
                                    <h4>' + dat.firstName + ' ' + dat.lastName + '</h4>\
                                    <h5>' + dist2 + " miles" + '</h5>\
                                </div>\
                             </div>');
            }
            else {
                $('#favoriteHeroes')
                     .append('<div class="HH-hero" data-userId="' + dat.idUsers + '" data-pushToken="' + dat.pushToken + '"> \
                                <div class="plus-sign">\
                                    <img src="img/plus.png" alt="edit favorite hero" onClick="callContacts()" />\
                                </div>\
                                <div class="HH-people">\
                                    <img src="' + dat.avatarUrl + '" /> </div>\
                                <div class="HH-name"> \
                                    <h4>' + dat.firstName + ' ' + dat.lastName + '</h4>\
                                    <h5>' + dist3 + " miles" + '</h5>\
                                </div>\
                             </div>');
            }
       });
    };
    var saveLocation = function (latLong) {
        $.ajax({
            type: "POST",
            url: "http://www.hallofheroesapp.com/php/saveLocation.php",
            dataType: "json",
            data: latLong,
            success: function (response) {
                alert("saved location");
            },
            error: function (response) {
               // alert("Error:" + response);
            }
        });
    }
    var distance = function(lat1, lon1, lat2, lon2, unit) {
        var radlat1 = Math.PI * lat1 / 180
        var radlat2 = Math.PI * lat2 / 180
        var theta = lon1 - lon2
        var radtheta = Math.PI * theta / 180
        var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
        dist = Math.acos(dist)
        dist = dist * 180 / Math.PI
        dist = dist * 60 * 1.1515
        if (unit == "K") { dist = dist * 1.609344 }
        if (unit == "N") { dist = dist * 0.8684 }
        return dist
    }
    //public functions
    var getFavoriteHeroes = function(){
        $.ajax({
              type: "GET",
              url: "http://www.hallofheroesapp.com/php/favorites.php",
              dataType: "json",
              success: function(response){
                  createFavoriteHeroes(response);
              },
              error: function(response){
                //alert("Error:" + response);
              }
        });
    };
    var makeCallToHeroes = function (color, senderName) {

        var tokenArray = new Array();
        jQuery('.HH-hero').each(function (i, dat) {
            tokenArray.push(jQuery(dat).data('pushtoken'));
        });
        var uniqueTokens = [];
        $.each(tokenArray, function (i, token) {
            if ($.inArray(token, uniqueTokens) === -1)
                uniqueTokens.push(token);
        });

        makeCallPending();
        navigator.geolocation.getCurrentPosition(function (position) {
            var longitude = position.coords.longitude;
            var latitude = position.coords.latitude;
            sessionStorage.setItem("latitude", latitude);
            sessionStorage.setItem("longitude", longitude);
            updateLatLongModule.callUpdateFunction(function () {

                pushModule.sendPushToOne(color, senderName, uniqueTokens[0]);
                setTimeout(function () {
                    pushModule.sendPushToOne(color, senderName, uniqueTokens[1]);
                }, 500);
                setTimeout(function () {
                    pushModule.sendPushToOne(color, senderName, uniqueTokens[2]);
                    if (color == "green")
                        window.location = "green.html";
                    else if (color == "yellow")
                        window.location = "yellow.html";
                    else if (color == "red")
                        window.location = "red.html";
                    else
                        alert("unrecognized color.");
                }, 1000);
            });
        }, function () { alert("error") });
        //pushModule.sendPushToAll(color,senderName);
      /* uniqueTokens.forEach(function (dat,i) {
           pushModule.sendPushToOne(color, senderName,uniqueTokens,pushModule.sendPushToOne);
        });*/
       
       /* if (color == "green")
            window.location = "green.html";
        else if (color == "yellow")
            window.location = "yellow.html";
        else if (color == "red")
            window.location = "red.html";
        else
            alert("unrecognized color.");*/
    };
    var makeCallPending = function () {
        $.ajax({
            type: "POST",
            url: "http://www.hallofheroesapp.com/php/setIfCallPending.php",
            data: {isPending: 1},
            dataType: "json",
            success: function () {
               // alert("pending saved");
            },
            error: function (response) {
               // alert(response + "error");
            }
        });
    };
    return{
        getFavoriteHeroes: getFavoriteHeroes,
        makeCallToHeroes: makeCallToHeroes
    }
}(jQuery));


