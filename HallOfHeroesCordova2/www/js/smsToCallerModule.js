var smsToCallerModule = (function () {
    var sendSmsToCaller = function () {
        var token = sessionStorage.getItem('callersPushToken');
        var heroFname = sessionStorage.getItem('firstName');
        var heroLname = sessionStorage.getItem('lastName');
        var message = $('#messageValue').val();
        var requestObject = { "platform": [1], "token": token, "msg": heroFname + ' ' + heroLname + ' ' + 'says ' + '"' + message + '"' };
        $.ajax({
            beforeSend: function (request) {
                request.setRequestHeader("x-pushbots-appid", "5758e8cd4a9efa067f8b4567");
                request.setRequestHeader("x-pushbots-secret", "c701b6d3137870dc0f082715aa19d964");
                request.setRequestHeader("Content-Type", "application/json");
            },
            type: "POST",
            url: "https://api.pushbots.com/push/one",
            data: JSON.stringify(requestObject),
            complete: function () {
                window.location = "heroGreen.html";
            },
            success: function () {
                //window.location = "heroGreen.html";
            },
            error: function (response) {
                // alert("Error:" + response);
            }
        });
    };
    var openDialog = function () {
        $("#dialog-sms").dialog({
            autoOpen: true,
            modal: true,
            buttons: {
                "Send": function () {
                    sendSmsToCaller();
                    $(this).dialog("close");
                },
                "Cancel": function () {
                    $(this).dialog("close");
                    window.location = "heroGreen.html";
                }
            }
        });
    };


    return {
        sendSmsToCaller: sendSmsToCaller,
        openDialog: openDialog
    };

}());
$(document).ready(function () {
    smsToCallerModule.openDialog();
});