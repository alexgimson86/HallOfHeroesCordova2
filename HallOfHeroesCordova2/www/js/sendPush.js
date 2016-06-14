function sendPush() {
    var requestObject = { "msg": "You requested a green call", "platform": [1] };
    $.ajax({
        beforeSend: function (request) {
            //var request = new XMLHttpRequest();
            //request.open("POST", "https://api.pushbots.com/push/all", true);
            request.setRequestHeader("x-pushbots-appid", "5758e8cd4a9efa067f8b4567");
            request.setRequestHeader("x-pushbots-secret", "c701b6d3137870dc0f082715aa19d964");
            request.setRequestHeader("Content-Type", "application/json");
        },
        type: "POST",
        url:"https://api.pushbots.com/push/all",
        data: JSON.stringify(requestObject),
       // data: {msg: "You requested a green call",platform: [1],schedule: new Date().getTime()},
        complete: function () {
            window.location = "green.html";
        },
        success: function(){
            alert("push was successful");
        },
        error: function (response) {
            alert("Error:" + response);
        }
    });
}