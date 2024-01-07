
//debugger;
var buttonColours = ["red","blue","green","yellow"];
var gamePattern = [];
var userChosenColour = "";
var userClickedPattern = []; 
var buttonsEnabled = false
var gameStartTimer;


// flash a button function
function flashButton(colour) {
    let target = "#" + colour;
    //let pressme = "." + colour + "flash";
    //$(target).fadeOut(100).fadeIn(100);

    $(target).addClass("pressed");
    setTimeout(() => {
        $(target).removeClass("pressed");
    }, 400);

    let soundFile = "./sounds/" + colour + ".mp3";
    let challengeSound = new Audio(soundFile);
    challengeSound.play();
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
    }, 750);
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
 
    //
    // Animate the press
    //
    $div.addClass("pressed");
    setTimeout(() => {
        $div.removeClass("pressed");
    }, 300);

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
        $("#level-title").text('You Lose. Press Spacebar to try again');
        // play lose sound
        let soundFile = "./sounds/wrong.mp3";
        let buttonSound = new Audio(soundFile);
        buttonSound.play();
        buttonsEnabled = false;

    }else{
        // play colour sound
        let soundFile = "./sounds/" + userChosenColour + ".mp3";
    
        let buttonSound = new Audio(soundFile);
        buttonSound.play();
    }

    if(userClickedPattern.length === gamePattern.length){
        nextChallenge();
    }
});

// Event Handler for key to start game
$(document).keypress(function (e) {
    if(e.key === " "){  // spacebar pressed - start game
        // Reset the game arrays
        gamePattern = [];
        userChosenColour = '';
        userClickedPattern = [];

        // Clear any timeouts
        clearTimeout(gameStartTimer)

        gameStartTimer = setTimeout( function () {
            // add random colour to game pattern
            $("#level-title").text('Game Started');
            var randomChosenColour = buttonColours[nextSequence()];
            gamePattern.push(randomChosenColour);
            flashButton(randomChosenColour);
            buttonsEnabled = true;
        }, 750)

    
    }
});




