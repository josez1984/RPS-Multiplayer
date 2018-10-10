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

        if(app.gameInProgress === 0) {
            if(app.player1Selected === true && app.player2Selected === true) {
                app.gameInProgress = 1;
                startCountDown(app);
            }
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

        if(app.gameInProgress === 0) {
            if(app.player1Selected === true && app.player2Selected === true) {
                app.gameInProgress = 1;
                startCountDown(app);
            }
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
            app.player1LastSign = snapshot.val();
        }
    });

    firebase.database().ref('/rpsMultiplayer/players/1/signEmit').on('value', function(snapshot){
        if(snapshot.val().length > 0) {
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
            $("#player-1-status").text(app.player1LastSign);
            $("#player-2-status").text(app.player2LastSign);
            checkWinner(app);
            setTimeout(function(){
                app.gameInProgress = 0;
            }, 3000);
            clearInterval(intervalId);
        }
    }, 1000);
}

function checkWinner(app) {
    var whoWon = 0;

    if(app.player1LastSign === app.player2LastSign) {
        return 0;
    }

    if(app.player1LastSign === 'paper' && app.player2LastSign === 'rock') {
        whoWon = 1;
    } else if(app.player1LastSign === 'rock' && app.player2LastSign === 'scissor') {
        whoWon = 1;
    } else if(app.player1LastSign === 'scissor' && app.player2LastSign === 'paper') {
        whoWon = 1;
    }

    // PLAYER 2
    if(app.player2LastSign === 'paper' && app.player1LastSign === 'rock') {
        whoWon = 2;
    } else if(app.player2LastSign === 'rock' && app.player1LastSign === 'scissor') {
        whoWon = 2;
    } else if(app.player2LastSign === 'scissor' && app.player1LastSign === 'paper') {
        whoWon = 2;
    }

    if(app.currentPlayer === 1 && whoWon === 1) {
        $("#timer-text").text("You Won");
    } else if(app.currentPlayer === 2 && whoWon === 2) {
        $("#timer-text").text("You Won");
    }
    
    if(app.currentPlayer === 1 && whoWon === 2) {
        $("#timer-text").text("You Lost");
    } else if(app.currentPlayer === 2 && whoWon === 1) {
        $("#timer-text").text("You Lost");
    }
}