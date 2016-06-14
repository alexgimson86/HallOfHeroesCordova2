var setIntervalModule = (function ($) {
    var setInterval = function (app) {
        window.setInterval(function () {
            //updateLatLongModule.callUpdateFunction();
            alert(app.marker.position);
        }, 10000)
    }
    return {
        setInterval : setInterval
    }
}(jQuery));