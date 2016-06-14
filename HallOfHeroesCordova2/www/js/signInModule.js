var signInModule = (function ($) {
    var signIn = function () {
        //get the users txstate email and password from the text boxes in the html
        var email = $('#txStateEmail').val();
        var password = $('#userPassword').val();
        verifyInfo(email, password);
    };
    var verifyInfo = function (email, password) {
        //ajax call that will send email and password variables to 
        //the corresponding php file to check the DB
        $.ajax({
            type: "GET",
            //php signIn.php file gets called
            url: "http://www.hallofheroesapp.com/php/signIn.php",
            dataType: "json",
            data: { email: email, password: password},
            success: function (response) {
                //on succcess of the PHP file, if response = -1 then the user exists and can proceed to home screen
                if (response !== -1) {
                    window.location = "home.html";
                }
                //else users account info is incorrect and display an error message
                else {
                    alert("Error. User does not exist");
                }
            },
            error: function (response) {
                alert("Error:" + response);
            }
        });
    };
    return {
        //return signIn function from the module to make this function public.
        signIn: signIn
    };

}(jQuery));