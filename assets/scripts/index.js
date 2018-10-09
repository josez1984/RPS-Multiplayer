$(document).ready(function(){
    var app = new App();
    
    firebase.initializeApp({
        apiKey: "AIzaSyA_Z7Uy5aNo1oU-BMjer3aG-DeDuGgSlcU",
        authDomain: "class-project-db.firebaseapp.com",
        databaseURL: "https://class-project-db.firebaseio.com",
        projectId: "class-project-db",
        storageBucket: "class-project-db.appspot.com",
        messagingSenderId: "286346014171"
    });

    var playersRef = firebase.database().ref('/rpsMultiplayer/players');
    var player1Ref = firebase.database().ref('/rpsMultiplayer/players/0/');
    var player2Ref = firebase.database().ref('/rpsMultiplayer/players/1/');

    // CLEAR THE LOBBY BUTTON
    $("#clear-lobby-btn").on("click", function(){
        $("#current-player-text").text("");

        player1Ref.update({
            'active': false,
            'id': '',
            'signEmit': '',
            'lastSignEmit': ''
        });

        player2Ref.update({
            'active': false,
            'id': '',
            'signEmit': '',
            'lastSignEmit': ''
        });
    });

    // PLAYER CHANGE EVENTS
    player1Ref.on('value', function(snapshot){
        if(snapshot.val().active === true) {
            $('#player1-btn').hide();
            app.player1Selected = true;
        } else {
            $('#player1-btn').show();
            app.player1Selected = false;
        }

        if(app.player1Selected === true && app.player2Selected === true) {
            app.alert("2 PLAYERS ARE READY LETS GO", true, 2500);
            startCountDown(app, function(){
                console.log("BOTH PLAYERS HAVE HIT");

            });
        }
    });

    player2Ref.on('value', function(snapshot){
        if(snapshot.val().active === true) {
            $('#player2-btn').hide();
            app.player2Selected = true;
        } else {
            $('#player2-btn').show();
            app.player2Selected = false;
        }

        if(app.player1Selected === true && app.player2Selected === true) {
            app.alert("2 PLAYERS ARE READY LETS GO", true, 2500);
            startCountDown(app, function(){
                console.log("BOTH PLAYERS HAVE HIT");
            });
        }
    });

    // PLAYER BUTTON CLICKS
    $("#player1-btn").on("click", function(){
        player1Ref.once('value').then(function(snapshot){
            if(snapshot.val().active === false) {                
                player1Ref.update({
                    'active': true,
                    'id': app.id
                }).then(function(){
                    $("#current-player-text").text("Player 1");
                    app.currentPlayer = 1;
                });
            } else {
                $('#player1-btn').hide();
            }
        });
    });

    $("#player2-btn").on("click", function(){
        player2Ref.once('value').then(function(snapshot){
            if(snapshot.val().active === false) {                
                player2Ref.update({
                    'active': true,
                    'id': app.id
                }).then(function(){
                    $("#current-player-text").text("Player 2");
                    app.currentPlayer = 2;
                });
            } else {
                $('#player2-btn').hide();
            }
        });
    });

    //PLAYER INITIAL LOADS
    player1Ref.once('value').then(function(snapshot){
        if(snapshot.val().active === true) {
            $("#player1-btn").hide();
        } else {
            $("#player1-btn").show();
        }
    });

    player2Ref.once('value').then(function(snapshot){
        if(snapshot.val().active === true) {
            $("#player2-btn").hide();
        } else {
            $("#player2-btn").show();
        }
    });

    $("#rock-btn").on("click", function(){
        if(app.currentPlayer === 1) {
            player1Ref.update({
                'signEmit': 'rock',
                'lastSignEmit': 'rock'
            }).then(function(){
                player1Ref.update({
                    'signEmit': ''
                })  
            });
        } else if(app.currentPlayer === 2) {
            player2Ref.update({
                'signEmit': 'rock',
                'lastSignEmit': 'rock'
            }).then(function(){
                player2Ref.update({
                    'signEmit': ''
                })  
            });
        }
    });

    $("#paper-btn").on("click",function(){
        if(app.currentPlayer === 1) {
            player1Ref.update({
                'signEmit': 'paper',
                'lastSignEmit': 'paper'
            }).then(function(){
                player1Ref.update({
                    'signEmit': ''
                })  
            });
        } else if(app.currentPlayer === 2) {
            player2Ref.update({
                'signEmit': 'paper',
                'lastSignEmit': 'paper'
            }).then(function(){
                player2Ref.update({
                    'signEmit': ''
                })  
            });
        }
    });

    $("#scissor-btn").on("click",function(){
        if(app.currentPlayer === 1) {
            player1Ref.update({
                'signEmit': 'scissor',
                'lastSignEmit': 'scissor'
            }).then(function(){
                player1Ref.update({
                    'signEmit': ''
                })  
            });
        } else if(app.currentPlayer === 2) {
            player2Ref.update({
                'signEmit': 'scissor',
                'lastSignEmit': 'scissor'
            }).then(function(){
                player2Ref.update({
                    'signEmit': ''
                })  
            });
        }
    });

    firebase.database().ref('/rpsMultiplayer/players/0/signEmit').on('value', function(snapshot){
        if(snapshot.val().length > 0) {
            app.alert("Player 1 shot: " + snapshot.val(), true, 2500);
            app.player1LastSign = snapshot.val();
        }
    });

    firebase.database().ref('/rpsMultiplayer/players/1/signEmit').on('value', function(snapshot){
        if(snapshot.val().length > 0) {
            app.alert("Player 2 shot: " + snapshot.val(), true, 2500);
            app.player2LastSign = snapshot.val();
        }
    });
});

function startCountDown(app, callBack) {
    $("#player-1-status").text('');
    $("#player-2-status").text('');

    var second = 4;
    var signMap = {
        '4': 'Rock',
        '3': 'Paper',
        '2': 'Scissor',
        '1': 'Shoot'
    };

    var intervalId = setInterval(function(){        
        if(second > 0) {
            $("#timer-text").text(signMap[second]);
            second--;
        } 
        
        if(app.player1LastSign.length > 0 && app.player2LastSign.length > 0) {
            clearInterval(intervalId);
            $("#player-1-status").text(app.player1LastSign);
            $("#player-2-status").text(app.player2LastSign);
        }
    }, 1000);
}