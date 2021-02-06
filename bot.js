const Discord = require('discord.js');
const auth = require('./auth.json');
const emoji_help = require('./Bot_modules/emoji_help.json');
const fs = require('fs');
const Bejeweled_Test = "693699875174613032"
const prefix = '+';
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
	if (!msg.content.startsWith(prefix) || msg.author.bot ) return; //|| msg.channel.id != Bejeweled_Test
	const args = msg.content.slice(prefix.length).trim().split(/ +/);
	let command = args.shift().toLowerCase();
	command = command.slice(0, command.indexOf('\n') < 0 ? undefined : command.indexOf('\n'))
	console.log(command)
	if (command === 'help'){
		const helptable = require('./Bot_modules/help_table.json')
		msg.channel.send(helptable.help)
	}
	else if (command === 'board'){
		if (args.length === 0) {msg.channel.send(emoji_help.help); return;}
		const splitted_msg =  msg.content.slice(prefix.length + command.length).trim().split("\n");
		let msg_returned = ""
		for(let i = 0; i < splitted_msg.length; i++) //gem rows
		{
			for(let j = 0; j < splitted_msg[i].length; j++) //each row character
			{
				if (splitted_msg[i][j] != " ")
				{
					let m = splitted_msg[i][j]
					if (j != splitted_msg[i].length-1) if (splitted_msg[i][j+1] != " ") {m += splitted_msg[i][j+1]; j++}
					msg_returned += ConvertToEmoji(m);
					console.log(m)
				}
				else msg_returned += " "
			}
			msg_returned += "\n"
		}
		msg.channel.send(msg_returned)//.then(message => setTimeout(() => {message.edit("siga min elitourgisei")}, 5000))
		console.log(splitted_msg);
	}
	else if (command === 'start_game'){
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
			board : initialize_board(8, 8)
		}
		let return_message = messagify_board(msg, ""); 
		msg.channel.send(return_message)
	}
	else if (command === 'swap'){
		if (current_games[msg.channel.id] != undefined){
			if (args.length == 3){
				if (args[0] <= 8 && args[0] > 0 && args[1] <= 8 && args[1] > 0){
					const xcoord = args[1] - (args[2] == "left") + (args[2] == "right")
					const ycoord = args[0] - (args[2] == "up") + (args[2] == "down")
					if (xcoord <= 8 && xcoord > 0 && ycoord <= 8 && ycoord > 0){
						if (xcoord != args[0] || ycoord != args[1]){ //if the direction word is none of the 4 (up,down etc..), the gem wont swap anywhere
							let gem1 = current_games[msg.channel.id].board[args[0]-1][args[1]-1]
							current_games[msg.channel.id].board[args[0]-1][args[1]-1] = current_games[msg.channel.id].board[ycoord-1][xcoord-1]
							current_games[msg.channel.id].board[ycoord-1][xcoord-1] = gem1
							msg.channel.send(messagify_board(msg, ""))
						}
						else msg.channel.send("The format of command is ```+swap [row] [collumn] [up/down/left/right]```")
					}
					else msg.channel.send("You can't swap there!")
				}
				else msg.channel.send("Arguments row and collumn must not exceed or fall short of board size")
			}
			else msg.channel.send("The format of command is ```+swap [row] [collumn] [up/down/left/right]```")
		}
		else msg.channel.send("You need to start a game first before trying to swap! Type ```+start_game```")
	}
	else msg.channel.send(`Can't understand, ${msg.author}`)
});

function initialize_board(rows, cols) {
	let board = [];
	do {
		board = [];
		const gem_skins = ["r","w","g","y","p","o","b"]
		for(let i = 0; i < 8; i++){
			board[i] = []
			for(let j = 0; j < 8; j++) {
				board[i][j] = {skin : gem_skins[get_random(gem_skins.length)], power : ""}
			}
		}
		
	} while(board_has_matches(board))

	return board;
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

function messagify_board(msg, message){
	for(let i = 0; i < 8; i++){
		message += "\n"
		for(let j = 0; j < 8; j++){
			const gem = current_games[msg.channel.id].board[i][j]
			message += ConvertToEmoji(gem.skin + gem.power) + " "
		}
	}
	return message;
}
function get_random(end_range) {
	return Math.floor(Math.random() * end_range);
}
