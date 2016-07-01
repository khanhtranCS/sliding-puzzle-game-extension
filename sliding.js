"use strict";

// initial white square location
var empty_x = 300;
var empty_y = 300;

window.onload = function () {
	// insert 15 tiles 
	init_tiles();
	document.getElementById("shuffle").onclick = shuffle;
}
// initialize 15 puzzle squares
function init_tiles() {
	var coords = [0, -100, -200, -300];
	var x_counter = 0;
	var y_counter = 0;
	var puzzle_area = document.getElementById("puzzlearea");
	var tiles_length = 15;
	// loop to create 15 tiles
	for (var i = 1; i <= tiles_length; i++) {
		var tile = document.createElement("div");
		var left_x = Math.abs(coords[x_counter]);
		var top_y = Math.abs(coords[y_counter]);
		// Since, each tile will have will contain full image; however,
		// it only contain 100x100 part of the whole image size of 400x400
		// so the image will be arrange respectively
		tile.style.backgroundImage = "url('background.jpg')";
		tile.style.backgroundPosition = coords[x_counter] + "px" + " " +coords[y_counter] + "px";
		tile.style.left = left_x + "px";
		tile.style.top = top_y + "px";
		// set up an id for each tile
		tile.id = "square_" + left_x + "_" + top_y;
		tile.onclick = moveTile;
		// if a mouse move over the tiles that is not movable
		// then remove its however property (change border and text color)
		tile.onmouseover = removeHover;
		x_counter++;
		if (x_counter == 4) {
			x_counter = 0;
			y_counter++;
		}
		// add inner text for the tile
		tile.innerHTML = "" + i;
		tile.className = "allTile"

		// insert tile into puzzle area
		puzzle_area.appendChild(tile);
	}
}

// function that determine if the tile is movable or not
function isMoveable(x, y) {
	// if the current square laid the the same x coord with the white square
	if (x == empty_x) {
		// if so, get distance between them, if it's 100, then it's moveable;
		// otherwise, it's not movable
		return Math.abs(y - empty_y) == 100;
	// if the current square laid on the same y coord with the white square
	} else if (y == empty_y) {
		return Math.abs(x-empty_x) == 100;
	}
	return false;
}

// function that will determine if the board have been solved or not
function solvedHuh () {
	// 
	var lst_square = document.getElementById("puzzlearea").getElementsByTagName("div");
	var x = 0;
	var y = 0;
	// loop through 15 square the label 1 to 15
	for (var i = 0 ; i < lst_square.length; i++) {
		// get the id (specified with current x and y position)
		var curr_position = lst_square[i].getAttribute("id");
		// expected position in order to be consider correct solve state
		var expected_position = "square_" + x + "_" + y;
		// if the current position doesn't match expected position
		if (curr_position != expected_position) {
			// the board is not solved
			return false;
		}
		// update the next column coordinate if this one is in correct position
		if (x == 300) {
			x = 0;
			y += 100;
		} else {
			x += 100;
		}
	}
	// if successfully escapte the loop, it mean that the board is solved, return true
	return true;
}

/*
 * Print congratulation message when the board is in solved stat
 */
function printCongrate (shuff_bool) {
	var output = document.getElementById("output");
	// if the board is in solved state and
	// the move is not made by shuffle button
	if (solvedHuh() && !shuff_bool) {
		var congrate_mess = document.createElement("div");
		congrate_mess.id = "congrat_mess";
		congrate_mess.innerHTML = "Congratulation! You won!!";
		output.appendChild(congrat_mess);
	} else if (output.hasChildNodes()) {
		// remove the message when the board is not in solved stat
		var child = output.firstChild;
		output.removeChild(child);
	}
}

/*
 * Function that will be use for purpose of remove code redundant for
 * the purpose of click to move and move by shuffle
 */
 function applyMove(tile, shuff_bool) {
 	// retrieve tile left pixel from css style sheet
 	var x = parseInt(window.getComputedStyle(tile).left);
 	var y = parseInt(window.getComputedStyle(tile).top);
 	// check if the tile is moveable or not before we move it
 	if (isMoveable(x,y)) {
 		tile.style.left = empty_x + "px";
 		tile.style.top = empty_y + "px";
 		// after change location, update the id name
 		tile.id = "square_" + empty_x + "_" + empty_y;
 		empty_x = x;
 		empty_y = y;
 		// after move being applied; call this function to determine
 		// whether or not the game has been successfully completed
 		printCongrate(shuff_bool);
 	}
 }

/*
 * Function that will be call when a tile being click
 */
 function moveTile() {
 	applyMove(this, false);
 }

// function that will shuffle the tiles
function shuffle() {
	console.log("shuffle bclick");
}

function removeHover() {
	console.log("removeHover is active");
}
