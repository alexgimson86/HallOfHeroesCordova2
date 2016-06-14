var favoritesModule = (function($){
    //private
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
                     .html('<div class="HH-hero"><div class="plus-sign">+</div>\
                        <div class="HH-people"><img src="' + dat.avatarUrl + '" />\
                        </div><div class="HH-name"><h2>' + dat.firstName + ' ' + dat.lastName + '<br>\
                        <span class="HH-miles">' + dist1 + " miles" + '</span></h2></div></div>');
            }
            else if (i === 1) {
                $('#favoriteHeroes')
                     .append('<div class="HH-hero"><div class="plus-sign">+</div>\
                        <div class="HH-people"><img src="' + dat.avatarUrl + '" />\
                        </div><div class="HH-name"><h2>' + dat.firstName + ' ' + dat.lastName + '<br>\
                        <span class="HH-miles">' + dist2 + " miles" + '</span></h2></div></div>');
            }
            else {
                $('#favoriteHeroes')
                     .append('<div class="HH-hero"><div class="plus-sign">+</div>\
                        <div class="HH-people"><img src="' + dat.avatarUrl + '" />\
                        </div><div class="HH-name"><h2>' + dat.firstName + ' ' + dat.lastName + '<br>\
                        <span class="HH-miles">' + dist3 + " miles" + '</span></h2></div></div>');
            }
       });
    };
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
                alert("Error:" + response);
              }
        });
    };
    return{
        getFavoriteHeroes: getFavoriteHeroes
    }
}(jQuery));


