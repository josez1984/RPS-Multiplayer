function App(params) {
    this.gameInProgress = 0;
    this.id = randN(10000000000, 100000000);
    this.player1Selected = false;
    this.player2Selected = false; 
    this.alert = alert;   
}

function alert(message, autoClose, autoCloseTime) {
    var alertId = "alert" + randN(100000, 1);
    $('#alert-placeholder').prepend('<div id="' + alertId + '" class="alert alert-custom alert-dismissible fade show bg-dark"><a id="alert-text" class="close" data-dismiss="alert">×</a><span>'+message+'</span></div>')
    if(autoClose == true) {
        setTimeout(function() { 
            $("#" + alertId ).alert('close');
        }, autoCloseTime);
    };
    return alertId;
};