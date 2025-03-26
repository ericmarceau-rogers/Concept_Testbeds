//
//	This version of code adapted by Eric Marceau, Ottawa, Canada
//	Intent of the code layout and comments is
//		- for reference documentation
//		- educational purposes as template example
//
//	Date:	2025-03-15
//
//###################################################################################
//
//	PSEUDO-CODE START
//
//	Simplified pseudo-code for logic segmentation within JavaScript game loop
//
//###################################################################################
/*
	function masterGameLoop(){

		// 1. Handle Input
		processInput() ;

		// 2. Update Game State
		changeState() ;

		// 3. Render Graphics
		render() ;
	
		// 4. Repeat the loop
		//window.requestAnimationFrame( masterGameLoop ) ;	// Original
		requestAnimationFrame( masterGameLoop ) ;		// Iteration 1
	}
	
	// 0. Initiate game loop
	//window.requestAnimationFrame( masterGameLoop ) ;		// Original
	//requestAnimationFrame( masterGameLoop ) ;			// Iteration 1
	masterGameLoop() ;						// Iteration 2

	// REF:	https://dev.to/chintanonweb/canvas-and-game-loops-explained-a-one-byte-overview-for-game-development-5epg
*/
//###################################################################################
//
//	PSEUDO-CODE END
//
//###################################################################################



//###################################################################################
//
//	Adaptation of Basic Game Loop provided in the following article:
//
//	REF:	https://www.sitepoint.com/quick-tip-game-loop-in-javascript/
//
//	KEY DIFFERENCES:
//		- code formatting for legibility
//		- replacing references to event.keyCode with event.key
//		- introduction of "maxspeed" variable
//		- adding inline comments about purpose of code segments
//
//###################################################################################


//
//	Define JavaScript canvas object that will be target for all graphics display
//
var canvas = document.getElementById("myGameCanvas") ;
var ctx = canvas.getContext("2d") ;


//
//	Set display size parameters outside of function for global accessibility
//
var width ;
var height ;


//
//	Define logic to adapt canvas "viewport" range to user's resizing of window
//
function reSize() {
	width  = window.innerWidth ;
	height = window.innerHeight ;
	canvas.width  = width ;
	canvas.height = height ;
}


//
//	Initialize parameters related to canvas object for sizing to window
//
reSize() ;


//
//	Define event watch for window resizing
//
window.addEventListener('resize', reSize);


//
//	Object definition to store state properties for Asteroids-like rocket ship
//
var state = {
	position: {
		x:	(width / 2),
		y:	(height / 2)
	},
	movement: {
		x:	0,
		y:	0
	},
	rotation: 0,
	keyPress: {
		left:	false,
		right:	false,
		up:	false,
		down:	false
	}
}


//
//	This code segment is of UNKNOWN USEFULNESS.
//	If is retained here for reference purposes only.
//
//	Not sure how these labels/values relate to those which are which are referenced in
//	the later code and are functional.
//
//	URL:	https://codeincomplete.com/articles/javascript-game-foundations-player-input/
//
//	N.B.: 	NOT using keyCode because it apparently varies among devices/manufacturers
/*
var KEY = {
    BACKSPACE: 8,
    TAB:       9,
    RETURN:   13,
    ESC:      27,
    SPACE:    32,
    PAGEUP:   33,
    PAGEDOWN: 34,
    END:      35,
    HOME:     36,
    LEFT:     37,
    UP:       38,
    RIGHT:    39,
    DOWN:     40,
    INSERT:   45,
    DELETE:   46,
    ZERO:     48, ONE: 49, TWO: 50, THREE: 51, FOUR: 52, FIVE: 53, SIX: 54, SEVEN: 55, EIGHT: 56, NINE: 57,
    A:        65, B: 66, C: 67, D: 68, E: 69, F: 70, G: 71, H: 72, I: 73, J: 74, K: 75, L: 76, M: 77, 
    N:	      78, O: 79, P: 80, Q: 81, R: 82, S: 83, T: 84, U: 85, V: 86, W: 87, X: 88, Y: 89, Z: 90,
    TILDA:    192
  };
*/


//
//	Functions for detecting keyboard input and handling/tracking state of keys pressed by user
//
function keydown(event) {
	var key = event.key ;
	state.keyPress[key] = true ;
}
function keyup(event) {
	var key = event.key ;
	state.keyPress[key] = false ;
}


//
//	Define event watch for when keys are pressed or not so as to know
//	when, or not, to respond to that key's programmed function
//
window.addEventListener("keydown",	keydown, false) ;
window.addEventListener("keyup",	keyup,	 false) ;


//
//	IMPORTANT:  Key label strings are CASE SENSITIVE
//
//	REF:	List of documented event key value "labels"
//	URL:	https://developer.mozilla.org/en-US/docs/Web/API/UI_Events/Keyboard_event_key_values#navigation_keys
//
//	Modifying state for change in orientation
//
function updateRotation(p) {
	if (state.keyPress.ArrowLeft) {
		//	Left:	event.key is "ArrowLeft",	keyCode is 37
		state.rotation -= p * 5 ;
	}
	else if (state.keyPress.ArrowRight) {
		//	Right:	event.key is "ArrowRight",	keyCode is 39
		state.rotation += p * 5 ;
	}
}


//
//	Modifying state for change in direction of movement based on orientation
//
function updateMovement(p) {
	// Mapping rotation to [x,y] vector components
	var accelerationVector = {
		x: p * 0.2 * Math.cos((state.rotation-90) * (Math.PI/180)),
		y: p * 0.2 * Math.sin((state.rotation-90) * (Math.PI/180))
	}

	if (state.keyPress.ArrowUp) {
		//	Up:	event.key is "ArrowUp",		keyCode is 38
		state.movement.x += accelerationVector.x ;
		state.movement.y += accelerationVector.y ;
	}
	else if (state.keyPress.ArrowDown) {
		//	Down:	event.key is "ArrowDown",	keyCode is 40
		state.movement.x -= accelerationVector.x ;
		state.movement.y -= accelerationVector.y ;
	}

	// Restrict movement to a pre-set maximum value
	const maxspeed = 40 ;
	if (     state.movement.x >  maxspeed ) {
		 state.movement.x =  maxspeed  ;
	}
	else if (state.movement.x < -maxspeed ) {
		 state.movement.x = -maxspeed  ;
	}
	if (     state.movement.y >  maxspeed ) {
		 state.movement.y =  maxspeed  ;
	}
	else if (state.movement.y < -maxspeed ) {
		 state.movement.y = -maxspeed  ;
	}
}


//
//	Modifying state for position change within display (a.k.a movement)
//	If motion carries toward one edge, it re-defines as moving away,
//	on same direction vector, away from the opposite edge of the canvas.
//
function updatePosition(p) {
	state.position.x += state.movement.x ;
	state.position.y += state.movement.y ;

	// Detect boundaries
	if (     state.position.x >  width) {
		 state.position.x -= width ;
	}
	else if (state.position.x <  0 ) {
		 state.position.x += width ;
	}
	if (     state.position.y >  height) {
		 state.position.y -= height ;
	}
	else if (state.position.y <  0 ) {
		 state.position.y += height ;
	}
}


//
//	Updating the complete game state as input for the next display refresh
//
function update(progress) {
	// Update the state of the world for the elapsed time since last render
	var p = progress / 16 ;

	updateRotation(p) ;		// Evaluate state for current ship orientation
	updateMovement(p) ;		// Evaluate state for current ship dynamics/momentum
	updatePosition(p) ;		// Evaluate state for resulting ship position
}


//
//	Re-drawing the graphics displayed representing the game's latest state image/frame
//
function draw() {
	// Draw the state of the world
	ctx.clearRect(0, 0, width, height) ;

	//
	// Save current canvas state
	//
	ctx.save() ;

	ctx.translate(state.position.x, state.position.y) ;
	ctx.rotate((Math.PI/180) * state.rotation) ;

	//
	//	Define style applied for all strokes (lines, circles, etc.)
	//
	ctx.strokeStyle = 'white' ;
	ctx.lineWidth = 2 ;

	//
	//	IMPORTANT:
	//	Use of beginPath() at every Frame will "flush" contents
	//	of canvas object, to prevent endless reserving of memory
	//	URL:	https://stackoverflow.com/a/23858808
	//
	ctx.beginPath() ;	// NB: required for delimiting start of object to which the "stroke()" action will apply
	//
	//	Draw the outline representing the ship that is to be controlled by the key-press signals
	//
	ctx.moveTo(  0,   0) ;		// [y,x]
	ctx.lineTo( 10,  10) ;
	ctx.lineTo(  0, -20) ;
	ctx.lineTo(-10,  10) ;
	ctx.lineTo(  0,   0) ;
	ctx.closePath() ;	// Directive to join current position on "path" with start of "path"

	ctx.stroke() ;		// Apply "style" to latest constructed path element

	ctx.restore() ;		// Directive that "pops" background construct of display contents onto canvas for display
}


//
//	Game Loop
//
function loop(timestamp) {
	var progress = timestamp - lastRender ;		// Calculate elapsed "real-time" used to 
							//  re-define the evolved game state

	update(progress) ;		// Re-assess components of game state based on elapsed "real-time"
	draw() ;			// Re-draw/Display graphics to refelct the new state of the game
	
	lastRender = timestamp ;	// Keep track of when last state UPDATE was performed
	
	//
	// Correct form for repetitively calling game loop for iterations
	//
	window.requestAnimationFrame(loop) ;		// ??? is "timestamp" variable implicit ???
}


//
//	Initialize timestamp reference
//
var lastRender = 0 ;


//
//	REF:	Method for starting the actual "Game Loop" per Mozilla
//	URL:	https://developer.mozilla.org/en-US/docs/Games/Anatomy
//
//window.requestAnimationFrame(loop) ;			// Original form
loop() ;						// Iteration 1



