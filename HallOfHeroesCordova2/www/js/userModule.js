var userModule = (function ($){
    //private
    var createUserMarkup = function(userArray){
        userArray.forEach(function (dat) {
            sessionStorage.setItem('firstName', dat.firstName);
            sessionStorage.setItem('lastName', dat.lastName);
            sessionStorage.setItem('url', dat.avatarUrl);
            $('.profile-main')
                    .append(' <div class="award"><div class="points">' +  dat.userPoints  + '</div> \
                                    <img src="img/trophy.png" /> \
                                    <p>Points</p> \
                                    </div> \
                                    <div class="profile-img"><img src="' + dat.avatarUrl + '" /></div> \
                                    <h2> ' + dat.firstName + ' ' + dat.lastName + '</h2>');
        })
    };
    //public
    var getUserInfo = function(){
        
        var userId = 1;
        $.ajax({
              type: "GET",
              url: "http://www.hallofheroesapp.com/php/user.php",
              dataType: "json",
              data: {userId : userId},
              success: function (response) {
                createUserMarkup(response);
              },
              error: function(response){
                //alert("Error:" + response);
              }
        });
    };
    
    return {
        getUserInfo: getUserInfo
    }
}(jQuery));


