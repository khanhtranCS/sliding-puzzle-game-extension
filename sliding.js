"use strict";

// initial white square location
var empty_x = 300;
var empty_y = 300;
// amount of shuffle times
var TOTAL_SHUFFLE = 1000;
// custom image link
var custom_img = 'https://cdn1.iconfinder.com/data/icons/appicns/513/appicns_Chrome.png';
window.onload = function () {
	// insert 15 tiles 
	//init_tiles();
	if (localStorage.getItem("prevHTML") === null) {
		init_tiles();
		saveSetting(empty_x, empty_y, document.getElementById("all").innerHTML, custom_img);
		// console.log("got into if: " + localStorage.getItem("prevHTML"));
	} else {
		resetSetting(localStorage.getItem("empty_X"), localStorage.getItem("empty_Y")
			, localStorage.getItem("prevHTML"), localStorage.getItem("img_url"));
		//console.log("got into else: " + localStorage.getItem("prevHTML"));
	}
	document.getElementById("shuffle").onclick = shuffle;
	document.getElementById("reset").onclick = resetGame;
	document.getElementById("userInput").onchange = changeImg;
}

function resetSetting(empty_X, empty_Y, bodyHTML, custom_img) {
	empty_x = empty_X;
	empty_y = empty_Y;
	var body = document.getElementById("all");
	body.innerHTML = "";
	body.innerHTML = bodyHTML;

	fixMissingFunc();
}
// fixing missing tile's functionality after store prev html as html text
function fixMissingFunc() {
	var all_tile = document.getElementsByClassName("allTile");
	var all_removeHov_tile = document.getElementsByClassName("removeHover");
	// remove through each tile, add functionality for each tile;
	// such if the tile is click, it'll move, and when a mouse move over
	// it'll light up if it's movable tile. This functionality is removed, after 
	// adding save previous setting for popup menu
	for(var i = 0; i < all_tile.length; i++) {
		all_tile[i].onclick = moveTile;
		all_tile[i].onmouseover = removeHover;
	}
	for (var i = 0; i < all_removeHov_tile.length; i++) {
		all_removeHov_tile[i].onclick = moveTile;
		all_removeHov_tile[i].onmouseover = removeHover;
	}
}

function saveSetting(empty_x, empty_y, bodyHTML, custom_img) {
	localStorage.setItem("prevHTML", bodyHTML);
	localStorage.setItem("empty_X", empty_x);
	localStorage.setItem("empty_Y", empty_y);
	localStorage.setItem("img_url", custom_img)
}

function changeImg() {
	console.log(this.value);
	custom_img = this.value;
	resetGame();
}

function resetGame() {
	init_tiles();
	empty_x = 300;
	empty_y = 300;
	saveSetting(empty_x, empty_y, document.getElementById("all").innerHTML);
}

// initialize 15 puzzle squares
function init_tiles() {
	var coords = [0, -100, -200, -300];
	var x_counter = 0;
	var y_counter = 0;
	var puzzle_area = document.getElementById("puzzlearea");
	puzzlearea.innerHTML = "";
	var tiles_length = 15;
	// loop to create 15 tiles
	for (var i = 1; i <= tiles_length; i++) {
		var tile = document.createElement("div");
		var left_x = Math.abs(coords[x_counter]);
		var top_y = Math.abs(coords[y_counter]);
		// Since, each tile will have will contain full image; however,
		// it only contain 100x100 part of the whole image size of 400x400
		// so the image will be arrange respectively
		tile.style.backgroundImage = "url('" + custom_img + "')";
		tile.style.backgroundSize = "400px 400px";
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
		// tile.innerHTML = "" + i;
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
function solvedHuh() {
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
function printCongrat (shuff_bool) {
	var output = document.getElementById("output");
	// if the board is in solved state and
	// the move is not made by shuffle button
	if (solvedHuh() && !shuff_bool) {
		var congrate_mess = document.createElement("div");
		congrate_mess.id = "congrat_mess";
		congrate_mess.innerHTML = "Congratulation! You won!!";
		output.appendChild(congrate_mess);
	} else if (output.hasChildNodes()) {
		// remove the message when the board is not in solved stat
		var child = output.firstChild;
		output.removeChild(child);
	}
}

/*
 * return the square element with corresponding coordinate
 */
 function getTile(x, y) {
 	var tile = document.getElementById("square_" + x + "_" + y);
 	return tile;
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
 		printCongrat(shuff_bool);
 	}

 }

/*
 * Function that will be call when a tile being click
 */
 function moveTile() {
 	applyMove(this, false);
 	saveSetting(empty_x, empty_y, document.getElementById("all").innerHTML);
 }

 function getPossibleMove() {
 	var lst_moves = [];

 	var directions = [-100, 100, -100, 100];
 	console.log("direction's length" + directions.length);
 	for (var i = 0; i < directions.length; i++) {
 		if (i < 2) {
 			// left and right move
 			// either left or right by 100px based on
 			// current empty square x coordinate
 			// convert empty_x to Int because it change to string after using localstorage
 			var move = getTile(parseInt(empty_x) + directions[i], empty_y);
 		} else {
 			// same idea, but for y
 			var move = getTile(parseInt(empty_x), empty_y + directions[i]);
 		}
 		// check if that square exist, append it into possible move list
 		if(move !== null) {
 			lst_moves.push(move);
 		}
 	}
 	// return list of moveable move
 	return lst_moves;
 }

// function that will shuffle the tiles
function shuffle() {
	// shuffle the board by moving all the tiles one by one in 1000 times,
	// which is enough for randomization
	for (var i = 0; i < TOTAL_SHUFFLE; i++ ) {
		var possible_moves = getPossibleMove();
		console.log(possible_moves);
		var rand_move = parseInt(Math.random() * possible_moves.length);
		applyMove(possible_moves[rand_move], true);
	}
	saveSetting(empty_x, empty_y, document.getElementById("all").innerHTML);
}

/*
 * print congratulation message
 * if shuff_bool is true, the move is made by shuffle button, it shouldn't produce
 * congratulation along the way of shuffle; else otherwise
 */
 function printCongrat(shuff_bool) {
 	var output = document.getElementById("output");
 	// if the board is in solved stat and
 	// the move is not made by shuffle
 	if (solvedHuh() && !shuff_bool) {
 		var congrat_mess = document.createElement("div");
 		congrat_mess.id = "congrat_mess";
 		congrat_mess.innerHTML = "Congratulation! You won!!";
 		output.appendChild(congrat_mess);
 	} else if (output.hasChildNodes()) {
 		// remove the message when the board is not in
 		// solved stat
 		var child = output.firstChild;
 		output.removeChild(child);
 	}
 }

/*
 * function that will disable hover css properties and will be used 
 * when mouse hover on non-moveable 
 */
function removeHover() {
	var x = parseInt(window.getComputedStyle(this).left);
	var y = parseInt(window.getComputedStyle(this).top);
	if (isMoveable(x,y)) {
		this.className = "allTile";
		return;
	}
	// if it's not moveable; then it have its original state without hover
	// properties
	this.className = "removeHover";
}
