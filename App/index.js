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
        <pre id="typewriter"><span class="var-highlight">Welcome Aboard!</span>

        <span class="var-highlight">The Battle Begins</span> In this marine epic, you will command
        your very own battleship.It's a game of wit and strategy where your every decision
        could lead to glorious triumph or a crushing defeat.
        Your battleship is ready for action, but are you prepared to take on the challenge?
        
        <span class="var-highlight">Coordinates and Strategy</span> Your battleship is equipped with an array 
        of powerful weaponry.To engage the enemy, simply select a letter from the left column
        <span class="string-highlight">(A to J)</span>and a number from the bottom row 
        <span class="string-highlight">(1 to 6)</span> to designate your target.
        
        <span class="var-highlight">The marine adventure awaits you, Captain. Set sail,
        make your choices, and may the best strategist emerge victorious!</span>  </pre>
        <div id="CTA">
            <button id="startGame" class="startGame">
                Start
            </button>
        </div>
        `

    }else{
        document.getElementById(parentElementId).innerHTML =`<pre id="typewriter"><span class="var-highlight">Welcome Aboard!</span>

        <span class="var-highlight">The Battle Begins</span> In this marine epic, you will command
        your very own battleship.It's a game of wit and strategy where your every decision
        could lead to glorious triumph or a crushing defeat.
        Your battleship is ready for action, but are you prepared to take on the challenge?
        
        <span class="var-highlight">Coordinates and Strategy</span> Your battleship is equipped with an array 
        of powerful weaponry.To engage the enemy, simply select a letter from the left column
        <span class="string-highlight">(A to J)</span>and a number from the bottom row 
        <span class="string-highlight">(1 to 6)</span> to designate your target.
        
        <span class="var-highlight">The marine adventure awaits you, Captain. Set sail,
        make your choices, and may the best strategist emerge victorious!</span>  </pre>
        <div id="CTA">
            <button id="startGame" class="startGame">
                Start
            </button>
        </div>
        `
    }

    //logic for ending game 
}

function end(){
    document.getElementById('restart').addEventListener('click',LodingSGame)
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
// var model = {
//     boardSize: 7,

//     numShips: 3,

//     shipLength: 3, 

//     shipsSunk: 0,

//     ships: [{ locations: [0, 0, 0], hits: ["", "", ""] },
//     { locations: [0, 0, 0], hits: ["", "", ""] },
//     { locations: [0, 0, 0], hits: ["", "", ""] }],

//     generateShipLocations: ()=>{
//         var locations
//         for (let i = 0; i < this.numShips; i++) {
//             do {

//               locations = this.generateShip()// generate new set of location

//             } while (this.collision(locations))//tell it is no collision 

//             this.ships[i].locations = locations//set the uncollision location to the ships array location 
//         }
//     },
//     // generate new location for the ship (random location )
//     generateShip: ()=> {
//         let direction = Math.floor(Math.random() * 2) 
//         let row, col
//         if (direction === 1) {// horizontal ship
//             // Generate a starting location for a horizontal ship

//             row = Math.floor(Math.random() * this.boardSize)
//             col = Math.floor(Math.random() * (this.boardSize - this.shipLength))
//             /**the ship is going to be placed horizontally, then the starting column must be between 0 and 4, so that we have room 
//             for the rest of the ship */

//         } else {// vertical ship
//             // Generate a starting location for a vertical ship
    
//             row = Math.floor(Math.random() * (this.boardSize - this.shipLength))
//             col = Math.floor(Math.random() * this.boardSize)
//             /**likewise,the ship is going to be placed vertically, then the starting row must be between 0 and 4, so that we have room 
//             for the rest of the ship */
//         }


//         //adding location to newShipLocations array
//         var newShipLocations = []

//         for (let i = 0; i < this.shipLength; i++) {

//             if (direction === 1) {
//                 //code for a horizontal ship location 
//                 newShipLocations.push(row + '' + (col + i)); //having fix row and variable coloum that is horizontal build
//             }else{
//                 //code for a vertically ship location 
//                 newShipLocations.push((row + i) + '' + col) //having fix coloum and variable row that is vertically build 
//             }
//         }
//         return newShipLocations
//     },

//     // Avoiding a collision!
//     collision: function(locations) {
//         for (let i = 0; i < this.numShips; i++) {//For each ship already on the board...
//             let ship = model.ships[i]
        
//             for (let j = 0; j < locations.length; j++) {
//                 if (ship.locations.indexOf(locations[j]) >= 0){
//                     return true
//                 }
//             }
//         }
//         //return false (there was no collision).
//         return false
//     },

//     fire: function(guess) {
//         for (let i = 0; i < this.numShips; i++) {
//             let ship = this.ships[i]
//             let index = ship.locations.indexOf(guess)

//             if (index >= 0) {
//                 ship.hits[index] = "hit"
//                 view.displayHit(guess)
//                 view.displayMessage("HIT!")
//                 if (this.isSunk(ship)) {

//                     view.displayMessage("You sank my battleship!")
//                     this.shipsSunk++ // add sunk ship

//                 }
//                 return true
//             }
//         }
//         view.displayMiss(guess)//miss
//         view.displayMessage("You missed.")
//         return false
//     },

//     isSunk: function(ship) {
//         for (let i = 0; i < this.shipLength; i++) {
//             if (ship.hits[i] !== "hit") {
//                 return false
//             }
//         }
//         return true
//     }
// }
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
        for (var i = 0; i < this.numShips; i++) {
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

            var ship = model.ships[i]

            for (var j = 0; j < locations.length; j++) {

                if (ship.locations.indexOf(locations[j]) >= 0) {
                    return true
                }
            }
        }
        // never found a match for any of the locations we were checking => return false (there was no collision).
        return false;
    },

    fire: function(guess) {
        for (var i = 0; i < this.numShips; i++) {
            var ship = this.ships[i]
            var index = ship.locations.indexOf(guess)

            if (index >= 0) {
                ship.hits[index] = "hit"
                view.displayHit(guess)
                // ask the view to display the message “HIT!”
                view.displayMessage("HIT!")
                //look if the ship sunk after this hit 
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

                } else if((hit && model.shipsSunk === model.numShips) && this.guesses >= '21'){
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

    /** add the call  to generate the ship locations,  which will fill in those empty  arrays in the model. 
        That way all the ships will have locations ready to go when you start playing.
    */
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






