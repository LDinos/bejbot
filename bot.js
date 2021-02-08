const Discord = require('discord.js');
const auth = require('./auth.json');
const emoji_help = require('./Bot_modules/emoji_help.json');
const fs = require('fs');
const Bejeweled_Test = "693699875174613032"
const prefix = '+';
const gem_skins = ["r","w","g","y","p","o","b"] //all skins to select from
var current_games = {}
let ConvertToEmoji = require('./Bot_modules/emoji_table.js');

// Initialize Discord Bot
const bot = new Discord.Client();
bot.login(auth.token);

bot.on('ready', () =>
{
	console.log("Welcome Back")
	//bot.channels.fetch(Bejeweled_Test).then(channel => {channel.send("Welcome Back!")})
});

bot.on('message', async msg =>
{
	if (!msg.content.startsWith(prefix) || msg.author.bot ) return; //dont do anything if the message doesn't start with the prefix
	const args = msg.content.slice(prefix.length).trim().split(/ +/); //returns the arguments after the command, eg '+swap 1 1 left' will return [1, 1, left]
	let command = args.shift().toLowerCase();
	command = command.slice(0, command.indexOf('\n') < 0 ? undefined : command.indexOf('\n')) //returns the command, eg '+swap 1 1 left' will return "swap"
	console.log(command)
	if (command === 'help'){
		const helptable = require('./Bot_modules/help_table.json')
		msg.channel.send(helptable.help)
	}
	else if (command === 'board'){
		if (args.length === 0) {msg.channel.send(emoji_help.help); return;}
		const splitted_msg =  msg.content.slice(prefix.length + command.length).trim().split("\n");
		let msg_returned = message_get_board(splitted_msg)
		msg.channel.send(msg_returned).then(msg.delete())
	}
	else if (command === 'replay'){
		if (current_games[msg.channel.id] != undefined && current_games[msg.channel.id].state != "stable") return;
		if (current_games[msg.channel.id] != undefined){
			if (current_games[msg.channel.id].replay.length != 0){
				console.log(current_games[msg.channel.id].replay.length)
				current_games[msg.channel.id].board = current_games[msg.channel.id].replay[0]
				current_games[msg.channel.id].state = "replay"
				msg.channel.send(messagify_board(msg, "\n")).then(msg_sent =>{
					current_games[msg.channel.id].current_message = msg_sent
					current_games[msg.channel.id].current_replay_frame++
					setTimeout(spawn_new_gems,2000,msg)
				})
			}
			else msg.channel.send("No moves were made for replay to work here")
		}
		else msg.channel.send("No game is created in this channel! Use ```+start_game```")
	}
	else if (command === 'start_game'){
		if (current_games[msg.channel.id] != undefined && current_games[msg.channel.id].state != "stable") return;
		current_games[msg.channel.id] = {
			stats : {
				score : 0,
				cascades : 0,
				total_moves : 0,
				last_move : {
					row : 0,
					col : 0,
				}
			},
			board : initialize_board(8, 8), //the board itself
			state : "stable", //state of board physics. stable = all gems are static, moving = gems are cascading / being swapped at the moment, replay = being replayed
			replay : [], //each board state is saved in an array so it can be replayed later on to see how the cascades happened
			current_replay_frame : 0, //while watching a replay, which frame are we on to right now?
			current_message : "" //the current message that displays the board. We save it here so we can edit it!
		}
		let return_message = messagify_board(msg, "\n"); 
		msg.channel.send(return_message)
	}
	else if (command === 'swap'){
		if (current_games[msg.channel.id] != undefined && current_games[msg.channel.id].state != "stable") return;
		if (args.length === 3){
			var xcoord = args[1] - (args[2] == "left") + (args[2] == "right")
			var ycoord = args[0] - (args[2] == "up") + (args[2] == "down")
			const canswap = check_swap_command(msg, args, xcoord, ycoord)
			if (canswap === "Swap okay"){
				let gem1 = current_games[msg.channel.id].board[args[0]-1][args[1]-1]
				current_games[msg.channel.id].board[args[0]-1][args[1]-1] = current_games[msg.channel.id].board[ycoord-1][xcoord-1]
				current_games[msg.channel.id].board[ycoord-1][xcoord-1] = gem1

				let matches_found = execute_matches(current_games[msg.channel.id].board)
				if (matches_found == 0){ //swap back
					gem1 = current_games[msg.channel.id].board[args[0]-1][args[1]-1]
					current_games[msg.channel.id].board[args[0]-1][args[1]-1] = current_games[msg.channel.id].board[ycoord-1][xcoord-1]
					current_games[msg.channel.id].board[ycoord-1][xcoord-1] = gem1
					msg.channel.send("No matches found with that swap!")
				}
				else {
					msg.channel.send(messagify_board(msg, "\n")).then(msg_sent =>{
						current_games[msg.channel.id].current_message = msg_sent
						current_games[msg.channel.id].state = "moving"
						current_games[msg.channel.id].replay = []
						add_replay_frame(msg)
						setTimeout(spawn_new_gems,2000,msg)
					})
				}
			}
			else msg.channel.send(canswap)
		} else msg.channel.send("Command format is ```+swap [row] [collumng] [left/right/up/down]```")
	}
	else msg.channel.send(`Can't understand, ${msg.author}`)
});

function initialize_board(rows, cols) { //Create board for the first time
	let board = [];
	do {
		board = [];
		for(let i = 0; i < 8; i++){
			board[i] = []
			for(let j = 0; j < 8; j++) {
				board[i][j] = {skin : gem_skins[get_random(gem_skins.length)], power : ""}
			}
		}
		
	} while(board_has_matches(board))

	return board;
}

function check_swap_command(msg, args, xcoord, ycoord){ //check if swapping is possible
	if (current_games[msg.channel.id] != undefined){
		if (args[0] <= 8 && args[0] > 0 && args[1] <= 8 && args[1] > 0){
			if (xcoord <= 8 && xcoord > 0 && ycoord <= 8 && ycoord > 0){
				if (xcoord != args[0] || ycoord != args[1]){ //if the direction word is none of the 4 (up,down etc..), the gem wont swap anywhere
					return "Swap okay";
				}
				else return "The format of command is ```+swap [row] [collumn] [up/down/left/right]```"
			}
			else return "You can't swap there!"
		}
		else return "Arguments row and collumn must not exceed or fall short of board size"
	}
	else return "You need to start a game first before trying to swap! Type ```+start_game```"

}
function board_has_matches(board) { //check if there are matches already in the board at its initial spawn
	for(let i = 0; i < 8; i++){
		let n_hor = 1;
		let n_ver = 1;
		for(let j = 1; j < 8; j++){
			if (board[i][j].skin === board[i][j-1].skin) n_hor++
			else n_hor = 1
			if (n_hor >= 3) return true;

			if (board[j][i].skin === board[j-1][i].skin) n_ver++
			else n_ver = 1
			if (n_ver >= 3) return true;
		}
	}
	return false;
}

function execute_matches(board){ //find matches and destroy the gems that got matched
	let matches_found = 0;
	for(let i = 0; i < 8; i++){
		let n_hor = 1;
		let n_ver = 1;
		let is_same_color = false;
		for(let j = 1; j < 8; j++){

			is_same_color = false;
			if (board[i][j].skin === board[i][j-1].skin) {n_hor++; is_same_color = true;}
			if (((j==7 && is_same_color) || (!is_same_color)) && n_hor >= 3) { //execute horizontal matches here
				for(let k = j-n_hor+is_same_color; k < j+is_same_color; k++){
					board[i][k].skin = -1 //empty cell
				}
				matches_found++
				n_hor = 1
			}
			else if (!is_same_color) n_hor = 1

			is_same_color = false;
			if (board[j][i].skin === board[j-1][i].skin) {n_ver++; is_same_color = true;}
			if (((j==7 && is_same_color) || (!is_same_color)) && n_ver >= 3) { //execute vertical matches here
				for(let k = j-n_ver+is_same_color; k < j+is_same_color; k++){
					board[k][i].skin = -1 //empty cell
				}
				matches_found++
				n_ver = 1
			}
			else if (!is_same_color) n_ver = 1			
		}
	}
	return matches_found;
}

function message_get_board(message){ //create a board depending on what the user has written (used in +board)
	let msg_returned =""
	for(let i = 0; i < message.length; i++) //gem rows
		{
			for(let j = 0; j < message[i].length; j++) //each row character
			{
				if (message[i][j] != " ")
				{
					let m = message[i][j]
					if (j != message[i].length-1) if (message[i][j+1] != " ") {m += message[i][j+1]; j++}
					msg_returned += ConvertToEmoji(m);
				}
				else msg_returned += " "
			}
			msg_returned += "\n"
		}
	return msg_returned;
}

function messagify_board(msg, initial_text){ //Take all gems and write them in a message format string
	for(let i = 0; i < 8; i++){
		initial_text += "\n"
		for(let j = 0; j < 8; j++){
			const gem = current_games[msg.channel.id].board[i][j]
			initial_text += ConvertToEmoji(gem.skin + gem.power) + " "
		}
	}
	return initial_text;
}

function spawn_new_gems(msg){ //spawn new gems after a match happened
	if (current_games[msg.channel.id].state === "replay"){
		const frame = current_games[msg.channel.id].current_replay_frame++
		current_games[msg.channel.id].board = current_games[msg.channel.id].replay[frame]
		if (frame < current_games[msg.channel.id].replay.length-1) {
			current_games[msg.channel.id].current_message.edit(messagify_board(msg, "\n")).then(setTimeout(check_cascade_matches, 2000, msg))
		}
		else {
			current_games[msg.channel.id].state = "stable"
			current_games[msg.channel.id].current_replay_frame = 0
			current_games[msg.channel.id].current_message.edit(messagify_board(msg, "\n"))
		}
	}
	else 
	{
		for(let j = 0; j < 8; j++){
			let k_end = 7;
			for(let i = k_end; i >= 0; i--){
				if (current_games[msg.channel.id].board[i][j].skin != -1) {
					const temp = current_games[msg.channel.id].board[k_end][j]
					current_games[msg.channel.id].board[k_end][j] = current_games[msg.channel.id].board[i][j]
					current_games[msg.channel.id].board[i][j] = temp
					k_end--
				}
			}
			for(let k = 0; k < k_end+1; k++) {
				current_games[msg.channel.id].board[k][j].skin = gem_skins[get_random(gem_skins.length)]
				current_games[msg.channel.id].board[k][j].power = ""
			}
		}
		add_replay_frame(msg)
		current_games[msg.channel.id].current_message.edit(messagify_board(msg, "\n")).then(setTimeout(check_cascade_matches, 2000, msg))
	}
}
function check_cascade_matches(msg){ //check if there are cascades after new gems spawned after a match
	if (current_games[msg.channel.id].state === "replay"){
		const frame = current_games[msg.channel.id].current_replay_frame++
		current_games[msg.channel.id].board = current_games[msg.channel.id].replay[frame]
		current_games[msg.channel.id].current_message.edit(messagify_board(msg, "\n")).then(setTimeout(spawn_new_gems, 2000, msg))
	}
	else
	{
		const matches_found = execute_matches(current_games[msg.channel.id].board)
		if (matches_found){
			add_replay_frame(msg)
			current_games[msg.channel.id].current_message.edit(messagify_board(msg, "\n")).then(setTimeout(spawn_new_gems, 2000, msg))
		}
		else current_games[msg.channel.id].state = "stable"
	}
}
function add_replay_frame(msg){ //add board on last position of replay array
	const len = current_games[msg.channel.id].replay.length
	current_games[msg.channel.id].replay[len] = JSON.parse(JSON.stringify(current_games[msg.channel.id].board))//current_games[msg.channel.id].board.slice()
}
function get_random(end_range) { //find random number between 0 and end_range-1
	return Math.floor(Math.random() * end_range);
}
