import Navigation from "../utils/PagesNavigation"


const welcomePage = document.getElementById('Welcome')
const GamePage = document.getElementById('Game')
const LodingState = document.getElementById('Loding')
const EndGame = document.getElementById('EndGame')

const NavigationArray = ['welcomePage','GamePage','LodingState','EndGame']



// ** Implementing the view

var view = {
    // this method takes a string message and displays it in the message display area
    displayMessage: function(msg) {

    var messageArea = document.getElementById("messageArea");
    messageArea.innerHTML = msg;

    },
    // this method takes  ( id ) of a <td> element  and apply hit class to it
    displayHit: function(location) {

    var cell = document.getElementById(location);
    cell.setAttribute("class", "hit");

    },

    // this method takes  ( id ) of a <td> element  and apply miss class to it
    displayMiss: function(location) {

    var cell = document.getElementById(location);
    cell.setAttribute("class", "miss");

    }
};
/*
// test activate the view by hardcoding 

view.displayMessage("Tap tap, is this thing on?");
view.displayMiss("00");
view.displayHit("34");
*/


// ** Implementing the the model
/*

// representing each ship as an object that holds the locations it sits in, along with the hits it’s taken {hardcoding location}=> later use random function 

var ships = [
    { locations: ["31", "41", "51"], hits: ["", "", ""] },
    { locations: ["14", "24", "34"], hits: ["", "hit", ""] },
    { locations: ["00", "01", "02"], hits: ["hit", "", ""] }];


// Finish this code to access the second ship's middle location and print its value 
// with console.log.

var ship2 = ships[1];
var locations = ship2.locations;
console.log("Location is " + locations[1]);


// Finish this code to see if the third ship has a hit in its first location:

var ship3 = ships[2];
var hits = ship3.hits;
if (hits[0] === "hit") {
 console.log("Ouch, hit on third ship at location one");
}

// Finish this code to hit the first ship at the third location:

var ship1 = ships[0];
var hits = ship1.hits;
hits[0] = 'hit';
console.log(ships[0].hits[0]);
*/


var model = {
    boardSize: 7,

    numShips: 3,

    shipLength: 3, 

    shipsSunk: 0,

    ships: [{ locations: [0, 0, 0], hits: ["", "", ""] },
    { locations: [0, 0, 0], hits: ["", "", ""] },
    { locations: [0, 0, 0], hits: ["", "", ""] }],

    generateShipLocations: function() {
        var locations;
        for (var i = 0; i < this.numShips; i++) {// for eash number of the ship we want to create 
            do {

              locations = this.generateShip();// generate new set of location generateShip();

            } while (this.collision(locations));//while it is  collision  regenerate  new location tell it is no collision 

            this.ships[i].locations = locations;//set the uncollision location to the ships array location 
        }

    },
    // generate new location for the ship (random location )
    generateShip: function() {
        var direction = Math.floor(Math.random() * 2);//rundom num 0 || 1 
        var row, col;
        if (direction === 1) { 
             // Generate a starting location for a horizontal ship

            row = Math.floor(Math.random() * this.boardSize);
            col = Math.floor(Math.random() * (this.boardSize - this.shipLength));
            /**the ship is going to be placed horizontally, then the starting column must be between 0 and 4, so that we have room 
            for the rest of the ship */

        } else { 
            // Generate a starting location for a vertical ship
    
            row = Math.floor(Math.random() * (this.boardSize - this.shipLength));
            col = Math.floor(Math.random() * this.boardSize);
            /**likewise,the ship is going to be placed vertically, then the starting row must be between 0 and 4, so that we have room 
            for the rest of the ship */
        }


        //adding location to newShipLocations array
        var newShipLocations = [];

        for (var i = 0; i < this.shipLength; i++) {

            if (direction === 1) {
                //code for a horizontal ship location 
                newShipLocations.push(row + '' + (col + i)); //having fix row and variable coloum that is horizontal build
            }else{
                //code for a vertically ship location 
                newShipLocations.push((row + i) + '' + col) //having fix coloum and variable row that is vertically build 
            }
        }
        // Once we’ve filled the array with the ship’s locations, we return it to the calling method, generateShipLocations
        return newShipLocations;
    },

    // Avoiding a collision!
    collision: function(locations) { // locations is an array of locations for a new ship we’d like to place on the boar

        for (var i = 0; i < this.numShips; i++) {//For each ship already on the board...

            var ship = model.ships[i];

            for (var j = 0; j < locations.length; j++) {

                if (ship.locations.indexOf(locations[j]) >= 0) { //go to  for eash ship[i(1,2,3,..)] => location of it => use index of(new location[j(1,2,3,.. tel the length )])
                                                                 // sheck for match beteen exist location & new location created randomly

                    //it matched an existing location, so we return true (meaning, we found a collision). 
                    return true;
                }
            }
        }
        // never found a match for any of the locations we were checking => return false (there was no collision).
        return false;
    },

    fire: function(guess) {
        for (var i = 0; i < this.numShips; i++) {
            var ship = this.ships[i];// For each ship loop through all ships model.ships[i] i=>(1,2,3,..)
            locations = ship.locations;
            var index = locations.indexOf(guess); //if the guess is in the locations array, we have a hit
            //notice that the indexOf method for an array is similar 
            //to the indexOf string method. It takes a value and returns 
            //the index of that value in the array (or -1 if it can't find the value).

            if (index >= 0) {
                // We have a hit!
                //so mark the hits array at the same index.
                ship.hits[index] = "hit";
                //Notify the view that we got a hit at the location in guess. (guess==> location of the hit) 
                view.displayHit(guess);
                // ask the view to display the message “HIT!”
                view.displayMessage("HIT!");
                //look if the ship sunk after this hit 
                if (this.isSunk(ship)) {// the ship is eader the ship 1 ,2 ,3  from the ships array (var ship = this.ships[i];)

                    //// ask the view to display the message “You sank my battleship!”
                    view.displayMessage("You sank my battleship!");
                    this.shipsSunk++; // add sunk ship

                }
                return true;
            }
        }
        //after you loop and not find the guess on any ship location 

        //Notify the view that we got a miss at the location in guess.
        view.displayMiss(guess);
        // ask the view to display the message “You missed.”
        view.displayMessage("You missed.");
        return false;
    },

    isSunk: function(ship) {
        // loop through all ships and see if hits are all hit if it is than ship is sunk
        for (var i = 0; i < this.shipLength; i++) {
            if (ship.hits[i] !== "hit") {
            return false;
        }
        }
        return true;// ship x(1,2,3,..tell the numShips) got hit[1,2,3,.. tell shipLength ] ==> ship got hit in all its place 
    }

};
//test((activate the fire by hardcoding) ==>  model.fire('00');


// ** Implementing the Controller

// Get and process the player’s guess (like “A0” or “B1”) ==> ( "00" or "11" )
function parseGuess(guess) {//guess is a string 

    var alphabet = ["A", "B", "C", "D", "E", "F", "G"];
    if (guess === null || guess.length !== 2) {
        alert("Oops, please enter a letter and a number on the board.");
    }else {

        firstChar = guess.charAt(0);//first caracter of the guess

        //then, using indexOf, we get back a number between zero 
        // and six that corresponds to the letter of the first guess
        var row = alphabet.indexOf(firstChar);// get the index as a number of  the first caracter of the guess if it exist                                       

        var column = guess.charAt(1);//second  caracter of the guess is alredy a number 
        //** is the first and second  carracter of the guess are valid 

        // after the row transform to number ==> both caracter of the guess should be a number 
        if (isNaN(row) || isNaN(column)) {

            alert("Oops, that isn't on the board.");

        } else if (row < 0 || row >= model.boardSize || column < 0 || column >= model.boardSize) {//if the number of the guess out of border size 

            alert("Oops, that's off the board!");

        } else {

            return row + column;
        }

    }
    //If any check failed, return null.
    return null;
}

var controller = {
    guesses: 0,

    processGuess: function(guess) {
        var location = parseGuess(guess);//process the  guess using parseGues function  and give it to location 

        if (location) {//location is valid 
            this.guesses++; //controller.guess++ count the guess only if  its valid 

            var hit = model.fire(location);// fire on place of the guess 
            // determine when the game is complete.
            if (hit && model.shipsSunk === model.numShips) {//the number of the sunk ship === number of the ships ?

                view.displayMessage("You sank all my battleships, in " + this.guesses + " guesses"); 
                
            }
        }
    }
    
};

//test((activate the controller by hardcoding) controller.processGuess("A6");

//add an event handler to the Fire! button or on key-press
function init() {

    // by fire button 
    var fireButton = document.getElementById("fireButton");
    fireButton.onclick = handleFireButton;
    // by keypress
    var guessInput = document.getElementById("guessInput");
    guessInput.onkeypress = handleKeyPress;


    /** add the call  to generate the ship locations,  which will fill in those empty  arrays in the model. 
        That way all the ships will have locations ready to go when you start playing.
    */
    model.generateShipLocations();


}

//get the geuss from the form by pressing 'RETURN key'
function handleKeyPress(e) {

    var fireButton = document.getElementById("fireButton");
    
    if (e.keyCode === 13) {    
        /** If you press the RETURN key, the 
        event's keyCode property will be set to 
        13. If that's the case, then we want to 
        cause the Fire! button to act like it 
        was clicked. We can do that by calling 
        the fireButton's click method (basically 
        tricking it into thinking it was clicked) */

        fireButton.click();
        return false;
    }
}

//get the geuss from the <form> by pressing the fire button 
function handleFireButton() {
    // code to get the value from the form
    var guessInput = document.getElementById("guessInput");
    var guess = guessInput.value;
   
    //Passing the input to the controller
    controller.processGuess(guess);

    //resets the form input element to be the empty string again 
    guessInput.value = "";
}
//we want the browser to run init when the page is fully loaded.
window.onload = init;






