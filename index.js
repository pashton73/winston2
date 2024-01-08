
//debugger;
var buttonColours = ["red","blue","green","yellow"];
var gamePattern = [];
var userChosenColour = "";
var userClickedPattern = []; 
var buttonsEnabled = false
var gameStartTimer;
var nextChallengeTimer;
var score = 0;
var gameOver = true
var flashTimer;
var animatePressTimer;
var winningScore = 6;

var flashTimerValue = 250;
var nextTimerValue = 750;
var startTimerValue = 750;
var intervalValueTimer = 750;
var gameStartTimerValue = 750;


// flash a button function
function flashButton(colour) {
    let target = "#" + colour;

    $(target).addClass("pressed");

    let soundFile = "./sounds/" + colour + ".mp3";
    let challengeSound = new Audio(soundFile);

    // When the sound finishes playing, remove the "pressed" class and clear the timer
    challengeSound.onended = function() {
        $(target).removeClass("pressed");
        clearTimeout(flashTimer);
    };

    challengeSound.play();

    // Set the timeout regardless, it will be cleared by onended if sound completes before timeout
    clearTimeout(flashTimer);
    flashTimer = setTimeout(function () {
        $(target).removeClass("pressed");
    }, flashTimerValue);
} 

// Get next random number 0-3
function nextSequence(){
    let returnVal = Math.floor(Math.random() * 4);
    return returnVal
}

// Get the next challenge
function nextChallenge() {
    // Get the length of the current challenge
    let currentChallengeLength = gamePattern.length;
    // Make a new challege that is 1 longer
    gamePattern = [];
    userClickedPattern = [];

    for( let i=0;i< (currentChallengeLength + 1);i++ ){
        randomChosenColour = buttonColours[nextSequence()];
        gamePattern.push(randomChosenColour); 
    }
    // Call flashButton 250 ms appart to show new challenge
    let count = 0;
    let interval = setInterval(function (){
        flashButton(gamePattern[count]);
        if(count === gamePattern.length - 1){
            clearInterval(interval);
        }
        count++
    }, intervalValueTimer); // time between flashes and chellenges
}

// Event Handler for button clicks 
$("div[type = 'button']").click(function () {
    // return out if buttons are disabled
    if(buttonsEnabled === false){
        return;
    }

    // Set reference to the button
    let $div = $(this);

    // set colour selected by user
    userChosenColour = $div.attr("id");
 
    // //
    // // Animate the press
    // //
    // $div.addClass("pressed");
    // clearTimeout(animatePressTimer);
    // animatePressTimer = setTimeout(() => {
    //     $div.removeClass("pressed");
    // }, 250);

    // Set the user's selection
    userClickedPattern.push(userChosenColour);

    // Are the array elements the same?
    let match = true;
    for(let i=0; i < userClickedPattern.length;i++){
        if(userClickedPattern[i] !== gamePattern[i]){
            match = false;
            break;
        }
    }
    if(match === false){
    
        //document.getElementById('level-title').textContent = 'You Lose';
        // play lose sound
        let soundFile = "./sounds/wrong.mp3";
        let buttonSound = new Audio(soundFile);
        buttonSound.play();
        buttonsEnabled = false;
        setImage(0);
        $("#level-title").text('You Lose!!');
        score=0
        gamePattern = [];
        userChosenColour = "";
        userClickedPattern = [];   
        gameOver = true


    }else{

        // play colour sound
        //let soundFile = "./sounds/" + userChosenColour + ".mp3";
        //let buttonSound = new Audio(soundFile);
        //buttonSound.play();
        flashButton(userChosenColour);
    }
    clearTimeout(nextChallengeTimer)
    if(userClickedPattern.length === gamePattern.length && gameOver === false) {
        if(score < winningScore){
            // increase score
            score++;
            setImage(score);
            $("#level-title").text('Level ' + score);
            clearTimeout(nextChallengeTimer);
            nextChallengeTimer = setTimeout(function () {
            nextChallenge();
            }, nextTimerValue)   
        } else {
            setImage(7);
            $("#level-title").text('You WIN!!');
            score=0
            gamePattern = [];
            userChosenColour = "";
            userClickedPattern = []; 
            buttonsEnabled = false;    
            let soundFile = "./sounds/win.mp3";
            let winSound = new Audio(soundFile);
            winSound.play();
            $('.winston-image').fadeOut(100).fadeIn(100).fadeOut(100).fadeIn(100);
        }

    }
});

function start() {
    // Reset the game arrays
    gamePattern = [];
    userChosenColour = '';
    userClickedPattern = [];
    gameOver = false;
    setImage(9);
    // Clear any timeouts
    clearTimeout(gameStartTimer);

    gameStartTimer = setTimeout(function () {
      // add random colour to game pattern
      $("#level-title").text('Game Started');
      var randomChosenColour = buttonColours[nextSequence()];
      gamePattern.push(randomChosenColour);
      flashButton(randomChosenColour);
      
      buttonsEnabled = true;
    }, gameStartTimerValue);
  }
  
  // Event Handler for key to start game
  $(document).keypress(function (e) {
    if (e.key === " ") { // spacebar pressed - start game
      start(); // Call the start function
    }
  });
  
  // Event handler to click start button
  $('.start').click(function () {
    $('.winston-image').fadeOut(100).fadeIn(100).fadeOut(100).fadeIn(100);
    start(); 
  });

  function setImage(number){
    let imageName = "./images/winston" + number + ".jpg";
    // Change the image source using jQuery
    $('.winston-image').attr('src', imageName);

  }
  




