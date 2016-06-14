var userModule = (function ($){
    
     
    //private
    var createUserMarkup = function(userArray){
        userArray.forEach(function(dat){
            $('.profile-main')
                    .append('<span class="trophy-point-style">'+ dat.userPoints + '</span>\
                             <img class="profile-icon1" id="trophyImage" src="img/trophy.png" />\
                             <!--<h3>5</h3>--><div class="profile-img"><img src="'+ dat.avatarUrl + '" />\
                             </div><div class="profile-icon2"><img src="img/edit.png" /><h3>Edit</h3>\
                             </div><div class="profile-name">\
                             <h2  class="profile-text">'+ dat.firstName + ' ' + dat.lastName + '</h2></div>');
                                       
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
              success: function(response){
                createUserMarkup(response);
              },
              error: function(response){
                alert("Error:" + response);
              }
        });
    };
    //private
    
   
    
    return {
        getUserInfo: getUserInfo
    }
}(jQuery));


