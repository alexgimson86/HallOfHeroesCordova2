function savePushRegistration(token) {
    $.ajax({
        type: "POST",
        url: "http://www.hallofheroesapp.com/php/savePushToken.php",
        data: { token: token },
        success: function () {
            alert("token was saved to the DB");
        },
        error: function (response) {
            alert("Error:" + response);
        }
    });
}