const app = document.getElementById("app")
const StartGameBtn = document.getElementById('startGame')
const enteredLocations = []

StartGameBtn.addEventListener('click',LodingSGame)

function LodingEGame(status){
    document.getElementById('Loding').classList.add('d-flex')
    setTimeout(()=>{
        document.getElementById('Loding').classList.remove('d-flex')
        generateGameEnd('app' ,status)
        end()
    },2000)
}

function LodingSGame(){
    document.getElementById('Loding').classList.add('d-flex')
    setTimeout(()=>{
        document.getElementById('Loding').classList.remove('d-flex')
        generateGameBoard('app')
        init()
    },2000)
}

function generateGameBoard(parentElementId) {

    document.getElementById(parentElementId).innerHTML = ''

    // Generate the game board HTML
    const gameBoard = document.createElement('div')
    gameBoard.id = 'board'

    // Create the message area
    const messageArea = document.createElement('div')
    messageArea.id = 'messageArea'
    gameBoard.appendChild(messageArea)

    const board = document.createElement('div')
    board.className = 'boardDiv'
    const table = document.createElement('table')
    for (let row = 0; row < 8; row++) {
        const tr = document.createElement('tr')

        for (let col = 0; col < 8; col++) {
            const td = document.createElement('td')

            if (col === 0) {
                // Leftmost column (letters)
                td.classList.add('number')
                if (row > 0) {
                    td.textContent = String.fromCharCode(64 + row)
                }
            } else {
                if (row === 0) {
                    // Top row (numbers)
                    td.classList.add('number')
                    td.textContent = col - 1
                } else {
                    // Game cells
                    td.id = `${row - 1}${col - 1}`
                }
            }

            tr.appendChild(td)
        }

        table.appendChild(tr)
    }

    const radar = document.createElement('div')
    radar.className='radar'
    board.appendChild(table)
    board.appendChild(radar)

    gameBoard.appendChild(board)


    // Create the input form
    const form = document.createElement('form')
    const guessInput = document.createElement('input')
    guessInput.type = 'text'
    guessInput.id = 'guessInput'
    guessInput.placeholder = 'A0'
    const fireButton = document.createElement('input')
    fireButton.type = 'button'
    fireButton.id = 'fireButton'
    fireButton.value = 'Fire!'
    form.appendChild(guessInput)
    form.appendChild(fireButton)
    gameBoard.appendChild(form)

    // Append the game board to the specified parent element
    document.getElementById(parentElementId).appendChild(gameBoard)
}
function generateGameEnd(parentElementId,status){

    document.getElementById(parentElementId).innerHTML = ''
    if(status ==='win'){
        document.getElementById(parentElementId).innerHTML =`
        <section class="welcome" id="Welcome">
            <img class="radio_nanny" src="assest/images/radio_nanny.png" alt="radio nanny">
            <p>
                <span>win</span>
            </p>
            <div id="CTA">
                <button id="restartGame" class="startGame">
                    Replay
                </button>
            </div>
        </section>
        `

    }else{
        document.getElementById(parentElementId).innerHTML =`
        <section class="welcome" id="Welcome">
            <img class="radio_nanny" src="assest/images/radio_nanny.png" alt="radio nanny">
            <p>
                <span>loose</span>
            </p>
            <div id="CTA">
                <button id="restartGame" class="startGame">
                    Replay
                </button>
            </div>
        </section>
        `
    }

    //logic for ending game 
}

function end(){
    document.getElementById('restartGame').addEventListener('click',LodingSGame)
}

// ** Implementing the view
var view = {
    displayMessage: function(msg) {

    let messageArea = document.getElementById("messageArea")
    messageArea.innerHTML = msg

    },
    displayHit: function(location) {
        let cell = document.getElementById(location)
        cell.setAttribute("class", "hit")
    },

    displayMiss: function(location) {
        let cell = document.getElementById(location)
        cell.setAttribute("class", "miss")
    }
}

// ** Implementing the the model
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
        for (let i = 0; i < this.numShips; i++) {
            do {

              locations = this.generateShip()
            } while (this.collision(locations))

            this.ships[i].locations = locations
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
            /**the ship is going to be placed vertically, then the starting row must be between 0 and 4, so that we have room 
            for the rest of the ship */
        }


        //adding location to newShipLocations array
        var newShipLocations = [];

        for (var i = 0; i < this.shipLength; i++) {

            if (direction === 1) {
                //code for a horizontal ship location 
                newShipLocations.push(row + '' + (col + i))
            }else{
                //code for a vertically ship location 
                newShipLocations.push((row + i) + '' + col)  
            }
        }
        
        return newShipLocations;
    },

    // Avoiding a collision!
    collision: function(locations) {

        for (let i = 0; i < this.numShips; i++) {//For each ship already on the board...

            var ship = model.ships[i]

            for (let j = 0; j < locations.length; j++) {

                if (ship.locations.indexOf(locations[j]) >= 0) {
                    return true
                }
            }
        }
        return false
    },

    fire: function(guess) {
        for (var i = 0; i < this.numShips; i++) {
            var ship = this.ships[i]
            var index = ship.locations.indexOf(guess)

            if (index >= 0) {
                ship.hits[index] = "hit"
                view.displayHit(guess)
                view.displayMessage("HIT!")
                if (this.isSunk(ship)) {

                    view.displayMessage("You sank my battleship!");
                    this.shipsSunk++ // add sunk ship

                }
                return true;
            }
        }

        view.displayMiss(guess);
        // ask the view to display the message “You missed.”
        view.displayMessage("You missed.");
        return false;
    },

    isSunk: function(ship) {
        for (var i = 0; i < this.shipLength; i++) {
            if (ship.hits[i] !== "hit") {
            return false
        }
        }
        return true
    }

}
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
            if (enteredLocations.includes(location)) {
                alert('You already entered this location!')
            } else {
                enteredLocations.push(location)
                this.guesses++
                const hit = model.fire(location)// fire on place of the guess 
                // determine when the game is complete.
                if ((hit && model.shipsSunk === model.numShips) && this.guesses <= '21' ) {//the number of the sunk ship === number of the ships ?
                    view.displayMessage("You sank all my battleships, in " + this.guesses + " guesses")
                    setTimeout(()=>{
                        LodingEGame('win')
                    },2000)

                } else if(this.guesses >= '21'){
                    view.displayMessage("we run out the bullets")
                    setTimeout(()=>{
                        LodingEGame('loose')
                    },2000)
                }
            }
        }
    }  
}

//test((activate the controller by hardcoding) controller.processGuess("A6");

//add an event handler to the Fire! button or on key-press
function init() {
    // by fire button 
    let fireButton = document.getElementById("fireButton")
    fireButton.onclick = handleFireButton
    // by keypress
    let guessInput = document.getElementById("guessInput")
    guessInput.onkeypress = handleKeyPress

    model.generateShipLocations()
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






