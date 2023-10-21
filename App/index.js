const app = document.getElementById("app")
const StartGameBtn = document.getElementById('startGame')

StartGameBtn.addEventListener('click',StartGame)

function StartGame(){
    console.log('its clicked')
    LodingGame()
}

function LodingGame(){
    document.getElementById('Loding').classList.add('d-flex')
    setTimeout(()=>{
        document.getElementById('Loding').classList.remove('d-flex')
        generateGameBoard('app')
        init()
    },1000)
}

function generateGameBoard(parentElementId) {
    const parentElement = document.getElementById(parentElementId);

    parentElement.innerHTML = '';

    // Generate the game board HTML
    const gameBoard = document.createElement('div');
    gameBoard.id = 'board';

    // Create the message area
    const messageArea = document.createElement('div');
    messageArea.id = 'messageArea';
    gameBoard.appendChild(messageArea);

    const table = document.createElement('table');
    for (let row = 0; row < 8; row++) {
        const tr = document.createElement('tr');

        for (let col = 0; col < 8; col++) {
            const td = document.createElement('td');

            if (col === 0) {
                // Leftmost column (letters)
                td.classList.add('number');
                if (row > 0) {
                    td.textContent = String.fromCharCode(64 + row);
                }
            } else {
                if (row === 0) {
                    // Top row (numbers)
                    td.classList.add('number');
                    td.textContent = col - 1;
                } else {
                    // Game cells
                    td.id = `${row - 1}${col - 1}`;
                }
            }

            tr.appendChild(td);
        }

        table.appendChild(tr);
    }

    gameBoard.appendChild(table);

    // Create the input form
    const form = document.createElement('form');
    const guessInput = document.createElement('input');
    guessInput.type = 'text';
    guessInput.id = 'guessInput';
    guessInput.placeholder = 'A0';
    const fireButton = document.createElement('input');
    fireButton.type = 'button';
    fireButton.id = 'fireButton';
    fireButton.value = 'Fire!';
    form.appendChild(guessInput);
    form.appendChild(fireButton);
    gameBoard.appendChild(form);

    // Append the game board to the specified parent element
    parentElement.appendChild(gameBoard);
}

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

// ** Implementing the the model
var model = {
    boardSize: 7,

    numShips: 3,

    shipLength: 3, 

    shipsSunk: 0,

    ships: [{ locations: [0, 0, 0], hits: ["", "", ""] },
    { locations: [0, 0, 0], hits: ["", "", ""] },
    { locations: [0, 0, 0], hits: ["", "", ""] }],

    generateShipLocations: ()=>{
        var locations
        for (let i = 0; i < this.numShips; i++) {
            do {

              locations = this.generateShip()// generate new set of location

            } while (this.collision(locations))//tell it is no collision 

            this.ships[i].locations = locations//set the uncollision location to the ships array location 
        }
    },
    // generate new location for the ship (random location )
    generateShip: ()=> {
        let direction = Math.floor(Math.random() * 2) 
        let row, col
        if (direction === 1) {// horizontal ship
            // Generate a starting location for a horizontal ship

            row = Math.floor(Math.random() * this.boardSize)
            col = Math.floor(Math.random() * (this.boardSize - this.shipLength))
            /**the ship is going to be placed horizontally, then the starting column must be between 0 and 4, so that we have room 
            for the rest of the ship */

        } else {// vertical ship
            // Generate a starting location for a vertical ship
    
            row = Math.floor(Math.random() * (this.boardSize - this.shipLength))
            col = Math.floor(Math.random() * this.boardSize)
            /**likewise,the ship is going to be placed vertically, then the starting row must be between 0 and 4, so that we have room 
            for the rest of the ship */
        }


        //adding location to newShipLocations array
        var newShipLocations = []

        for (let i = 0; i < this.shipLength; i++) {

            if (direction === 1) {
                //code for a horizontal ship location 
                newShipLocations.push(row + '' + (col + i)); //having fix row and variable coloum that is horizontal build
            }else{
                //code for a vertically ship location 
                newShipLocations.push((row + i) + '' + col) //having fix coloum and variable row that is vertically build 
            }
        }
        return newShipLocations
    },

    // Avoiding a collision!
    collision: function(locations) {

        for (let i = 0; i < this.numShips; i++) {//For each ship already on the board...
            var ship = model.ships[i]

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
            var index = ship.locations.indexOf(guess); //if the guess is in the locations array, we have a hit
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


// Get and process the player’s guess (like “A0” or “B1”) ==> ( "00" or "11" )
function parseGuess(guess) {
    let alphabet = ["A", "B", "C", "D", "E", "F", "G"]
    if (guess === null || guess.length !== 2) {
        alert("Oops, please enter a letter and a number on the board.")
    }else {
        let row = alphabet.indexOf(guess.charAt(0))                                      
        let column = guess.charAt(1)
        
        if (isNaN(row) || isNaN(column)) {//out the board

            alert("Oops, that isn't on the board.")

        } else if (row < 0 || row >= model.boardSize || column < 0 || column >= model.boardSize) {//off the board

            alert("Oops, that's off the board!")

        } else {//on the board
            return row + column
        }
    }
    return null
}

// ** Implementing the Controller
let controller = {
    guesses: 0,

    processGuess: function(guess) {
        var location = parseGuess(guess)

        if (location) {//location is valid 
            this.guesses++
            const hit = model.fire(location)// fire on place of the guess 
            // determine when the game is complete.
            if (hit && model.shipsSunk === model.numShips) {//the number of the sunk ship === number of the ships ?

                view.displayMessage("You sank all my battleships, in " + this.guesses + " guesses"); 
                
            }
        }
    }  
}
//test((activate the controller by hardcoding) controller.processGuess("A6");


//add an event handler to the Fire! button or on key-press
function init() {
    // by fire button 
    let fireButton = document.getElementById("fireButton");
    fireButton.onclick = handleFireButton;
    // by keypress
    let guessInput = document.getElementById("guessInput");
    guessInput.onkeypress = handleKeyPress;


    /** add the call  to generate the ship locations,  which will fill in those empty  arrays in the model. 
        That way all the ships will have locations ready to go when you start playing.
    */
    model.generateShipLocations();


}

function handleKeyPress(e) {
    if (e.keyCode === 13) {    
        document.getElementById("fireButton").click()
        return false
    }
}

function handleFireButton() {
    let guessInput = document.getElementById("guessInput")
    let guess = guessInput.value//form value
   
    controller.processGuess(guess)
    guessInput.value = ""
}






