var getClosestHeroesModule = (function($){
    //public
    var iduser = 1;
    var getAllHeroesInfo = function () {
        $.ajax({
            type: "GET",
            url: "http://www.hallofheroesapp.com/php/getClosestHeroes.php",
            data:{iduser: iduser},
            dataType: "json",
            success: function (response) {
                getClosestHeroes(response);
            },
            error: function (response) {
                alert("Error:" + response);
            }
        });
    };
    //private
    var getClosestHeroes = function (heroArray) {
        var myLatitude = sessionStorage.getItem('latitude');
        var myLongitude = sessionStorage.getItem('longitude');
        var distanceArray = [];
        heroArray.forEach(function (dat, i) {
            distanceArray.push(getDistance(myLatitude, myLongitude, dat.latitude, dat.longitude, "M"));
        });
        var closestHeroesArray = [];
        var indexesOfClosestHeroes = [];

        for(var i = 0 ; i < 6;i++)
        {
            var index;
            for (index = 0; index < distanceArray.length && distanceArray[index] == -1; index++) { }
            var closest = distanceArray[index];

            for (var j = 0; j < distanceArray.length; j++) {
                if (distanceArray[j] !=-1 && distanceArray[j] < closest) {
                    closest = distanceArray[j];
                    index = j;
                }
            }
            closestHeroesArray.push(closest);
            indexesOfClosestHeroes.push(index);
            distanceArray[index] = -1;
        }
        outputClosestHeroes(heroArray, closestHeroesArray, indexesOfClosestHeroes);
    }
    var outputClosestHeroes = function (heroArray, closestHeroesArray, indexesOfClosestHeroes) {
        $('#nearbyHeroesOne').empty();
        $('#nearbyHeroesTwo').empty();
        for (var i = 0;i < closestHeroesArray.length &&  i < 6; i++) {
            var $heroesDiv;
            if (i < 3)
                $heroesDiv = $('#nearbyHeroesOne');
            else
                $heroesDiv = $('#nearbyHeroesTwo');

            $heroesDiv.append('<div class="HH-hero">\
                                    <div class="HH-people">\
                                        <img src="' + heroArray[indexesOfClosestHeroes[i]].avatarUrl + '" />\
                                </div>\
                                <div class="HH-name">\
                                    <h2>\
                                            ' + heroArray[indexesOfClosestHeroes[i]].firstName + ' ' + heroArray[indexesOfClosestHeroes[i]].lastName + ' <br>\
                                        <span class="HH-miles"> ' + closestHeroesArray[i].toFixed(1) + ' mi ' + ' </span>\
                                    </h2>\
                                    </div>\
                                </div>'
            );
        }
        
    }
    //calculate the distance of all heroes from the user
    var getDistance = function (lat1, lon1, lat2, lon2, unit) {
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
    return {
        getAllHeroesInfo: getAllHeroesInfo
    }
}(jQuery));