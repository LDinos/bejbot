const Discord = require('discord.js');
const fs = require('fs');
const CreateBoardImage = require('./Bot_modules/imagecreator')
const auth = require('./auth.json');
const emoji_help = require('./Bot_modules/emoji_help.json');
const ConvertToEmoji = require('./Bot_modules/emoji_table.js');
const ConvertToLetter = require('./Bot_modules/letter_table')

const prefix = '+';
const delay = 2000 //Timeout delay when matching gems
const gem_skins = ["r","w","g","y","p","o","b"] //all skins to select from
let current_games = {} //class that holds current games for each discord channel
const debug = false; //if true, the bot will work only in a specific channel, with the id of Bejeweled_Test below
const Bejeweled_Test = "694241477160861796"

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
	if (debug) if (msg.channel.id !== Bejeweled_Test) return msg.channel.send("I am being developed in a very secret channel right now, so you can't use me at the moment!")
	if (msg.guild === null) return msg.channel.send("I can't be used in DM's")
	if (!msg.guild.me.permissionsIn(msg.channel).has('MANAGE_CHANNELS')) return msg.channel.send("I can't be used here! Maybe try the channels that were made for me?")

	const args = msg.content.slice(prefix.length).trim().split(/ +/); //returns the arguments after the command, eg '+swap 1 1 left' will return [1, 1, left]
	let command = args.shift().toLowerCase();
	command = command.slice(0, command.indexOf('\n') < 0 ? undefined : command.indexOf('\n')) //returns the command, eg '+swap 1 1 left' will return "swap"
	console.log(command)

	switch(command)
	{
		case 'source':
		case 'info':
		case 'link':
		case 'code':
			msg.channel.send("I am an open source bot! Find my code at https://github.com/LDinos/bejbot")
			break;
		case 'help':
		case 'list':
			const helptable = require('./Bot_modules/help_table.json')
			msg.channel.send(helptable.help)
			break;
		case 'text':
		case 'say':
			let final_msg = ""
			for(let i = 0; i < args.length; i++){
				for(j = 0; j < args[i].length; j++){
					final_msg += ConvertToLetter(args[i][j].toLowerCase())+ " "
				}
				final_msg+=" "
			}
			msg.channel.send(final_msg).catch(err =>{
				if (err) msg.channel.send("Message is too long to write!")
				else msg.channel.send(final_msg)
			})
			break;
		case 'show':
		case 'show_board':
			if (current_games[msg.channel.id] !== undefined) msg.channel.send(messagify_board(msg, "\n"))
			else msg.channel.send("No games are present. Use ```+start_game```")
			
			break;
		case 'board_image':
		case 'board':
			if (args.length === 0) {msg.channel.send(emoji_help.help); return;}
			const splitted_msg = msg.content.slice(prefix.length + command.length).trim().split("\n");
			if (command === 'board_image') {
				let board = message_create_board_array(splitted_msg)
				await CreateBoardImage(board)
				await msg.channel.send("",{files: ['image.png']})
			}
			else{
				let msg_returned = message_get_board(splitted_msg)
				msg.channel.send(msg_returned).catch(err =>{
					if (err) msg.channel.send("Message is too long to write!")
					else msg.channel.send(msg_returned)
				})
			}
				
			break;
		case 'replay':
			if (current_games[msg.channel.id] !== undefined && current_games[msg.channel.id].state !== "stable") return;
			if (current_games[msg.channel.id] !== undefined){
				if (current_games[msg.channel.id].replay.length !== 0){
					current_games[msg.channel.id].board = current_games[msg.channel.id].replay[0]
					current_games[msg.channel.id].state = "replay"
					msg.channel.send(messagify_board(msg, "\n")).then(msg_sent =>{
						current_games[msg.channel.id].current_message = msg_sent
						current_games[msg.channel.id].current_replay_frame++
						current_games[msg.channel.id].timeout = setTimeout(spawn_new_gems,delay,msg)
					})
				}
				else msg.channel.send("No moves were made for replay to work here")
			}
			else msg.channel.send("No game is created in this channel! Use ```+start_game```")
			break;
		case 'stop_game':
		case 'stop':
			if (current_games[msg.channel.id] !== undefined){
				//if (current_games[msg.channel.id].creator === msg.author || msg.member.hasPermission('MANAGE_MESSAGES')){
					if (current_games[msg.channel.id].timeout !== undefined) clearTimeout(current_games[msg.channel.id].timeout)
					current_games[msg.channel.id] = undefined
					msg.channel.send("Game is destroyed")
				//}
				//else msg.channel.send(`Only moderators/admins or the game creator ${current_games[msg.channel.id].creator.username} can stop the current game`)
			}
			else msg.channel.send("No current games found to stop!")
			break;
		case 'start_game':
		case 'start':
		case 'restart':
		case 'play':
			if (current_games[msg.channel.id] !== undefined) return msg.channel.send("You must first finish the current game with ```+stop_game```")
			let jsonfile = fs.readFileSync('./Bot_modules/board_template.json');
			const template = JSON.parse(jsonfile);
			current_games[msg.channel.id] = template
			current_games[msg.channel.id].creator = msg.author
			if (args.length === 1){
				
				if (!isNaN(args[0]) && args[0] < 8 && args[0] > 2) {args[0] = Math.trunc(args[0]); current_games[msg.channel.id].rules.num_skins = args[0]}
				else msg.channel.send("Argument must be a number from 3 to 7. Setting game to 7 skins by default:")
			}
			current_games[msg.channel.id].board = initialize_board(msg, 8, 8)
			let return_message = messagify_board(msg, "\n"); 
			msg.channel.send(return_message)
			break;
		case 'swap':
			if (current_games[msg.channel.id] !== undefined && current_games[msg.channel.id].state !== "stable") return;
			if (args.length === 3){
				args[0] = Math.trunc(args[0])
				args[1] = Math.trunc(args[1])
				var xcoord = args[1] - (args[2] === "left") + (args[2] === "right")
				var ycoord = args[0] - (args[2] === "up") + (args[2] === "down")
				const canswap = check_swap_command(msg, args, xcoord, ycoord)
				if (canswap === "Swap okay"){
					let gem1 = current_games[msg.channel.id].board[args[0]-1][args[1]-1]
					current_games[msg.channel.id].board[args[0]-1][args[1]-1] = current_games[msg.channel.id].board[ycoord-1][xcoord-1]
					current_games[msg.channel.id].board[ycoord-1][xcoord-1] = gem1

					let matches_found = execute_matches(msg, current_games[msg.channel.id].board)
					if (matches_found === 0){ //swap back
						gem1 = current_games[msg.channel.id].board[args[0]-1][args[1]-1]
						current_games[msg.channel.id].board[args[0]-1][args[1]-1] = current_games[msg.channel.id].board[ycoord-1][xcoord-1]
						current_games[msg.channel.id].board[ycoord-1][xcoord-1] = gem1
						msg.channel.send("No matches found with that swap!")
					}
					else {
						current_games[msg.channel.id].stats.cascades = 1
						current_games[msg.channel.id].state = "moving"
						current_games[msg.channel.id].stats.last_move.user = msg.author.username
						current_games[msg.channel.id].stats.last_move.user_avatar = msg.author.avatarURL()
						current_games[msg.channel.id].stats.last_move.row = args[0]
						current_games[msg.channel.id].stats.last_move.col = args[1]
						msg.channel.send(messagify_board(msg, "\n")).then(msg_sent =>{
							current_games[msg.channel.id].current_message = msg_sent
							current_games[msg.channel.id].replay = []
							add_replay_frame(msg)
							current_games[msg.channel.id].timeout = setTimeout(spawn_new_gems,delay,msg)
						})
					}
				}
				else msg.channel.send(canswap)
			} else msg.channel.send("Command format is ```+swap [row] [collumn] [left/right/up/down]```")
			break;
		default: msg.channel.send(`Can't understand, ${msg.author}`); break;
	}
});

function initialize_board(msg, rows, cols) { //Create board for the first time
	const num_skins = current_games[msg.channel.id].rules.num_skins
	let board = [];
	do {
		board = [];
		for(let i = 0; i < 8; i++){
			board[i] = []
			for(let j = 0; j < 8; j++) {
				board[i][j] = {skin : gem_skins[get_random(num_skins)], power : ""}
			}
		}
		
	} while(board_has_matches(board))

	return board;
}

function check_swap_command(msg, args, xcoord, ycoord){ //check if swapping is possible
	if (current_games[msg.channel.id] !== undefined){
		if (args[0] <= 8 && args[0] > 0 && args[1] <= 8 && args[1] > 0){
			if (xcoord <= 8 && xcoord > 0 && ycoord <= 8 && ycoord > 0){
				if (xcoord !== args[0] || ycoord !== args[1]){ //if the direction word is none of the 4 (up,down etc..), the gem wont swap anywhere
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

function execute_matches(msg, board){ //find matches and destroy the gems that got matched
	let matches_found = 0;
	let matched_gems = []
	for(let i = 0; i < 8; i++){
		let n_hor = 1;
		let n_ver = 1;
		let is_same_color = false;
		for(let j = 1; j < 8; j++){

			is_same_color = false;
			if (board[i][j].skin === board[i][j-1].skin) {n_hor++; is_same_color = true;}
			if (((j===7 && is_same_color) || (!is_same_color)) && n_hor >= 3) { //execute horizontal matches here
				for(let k = j-n_hor+is_same_color; k < j+is_same_color; k++){
					matched_gems.push(board[i][k])
				}
				matches_found++
				n_hor = 1
			}
			else if (!is_same_color) n_hor = 1

			is_same_color = false;
			if (board[j][i].skin === board[j-1][i].skin) {n_ver++; is_same_color = true;}
			if (((j===7 && is_same_color) || (!is_same_color)) && n_ver >= 3) { //execute vertical matches here
				for(let k = j-n_ver+is_same_color; k < j+is_same_color; k++){
					matched_gems.push(board[k][i])
				}
				matches_found++
				n_ver = 1
			}
			else if (!is_same_color) n_ver = 1			
		}
	}
	for(i = 0; i < matched_gems.length; i++) matched_gems[i].skin = -1
	return matches_found;
}
function message_create_board_array(message){ //create a board array depending on what the user has written
	let board_array=[];
	for(let i = 0; i < message.length; i++) //gem rows (if u write two rows of g g, this will return ['g g', 'g g'])
	{
		board_array[i] = []
		let j_start = 0;
		for(let j = 0; j < message[i].length; j++) //each character from each row (for example from the first row we get ['g', 'g'])
		{
			if (message[i][j] !== " ")
			{
				let m = message[i][j]
				let p = ""
				let cont = false
				if (j !== message[i].length-1) { //if we are not at the end of the row message
					if (message[i][j+1] !== " ") { //and the character after this is not empty (=power)
						p = message[i][j+1]; //get the power
						cont = true //and make j++ since we checked two characters at once
					}
				}
				board_array[i][j_start] = {skin : m, power : p}
				j_start++
				if (cont) j++
			}
		}
	}
	return board_array;
}
function message_get_board(message){ //create an emoji board string depending on what the user has written (used in +board)
	let msg_returned =""
	for(let i = 0; i < message.length; i++) //gem rows
	{
		for(let j = 0; j < message[i].length; j++) //each row character
		{
			if (message[i][j] !== " ")
			{
				let m = message[i][j]
				if (j !== message[i].length-1) if (message[i][j+1] !== " ") {m += message[i][j+1]; j++}
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
	let state = "Ready!"
	if (current_games[msg.channel.id].state === "moving") state = "Standby..."
	else if (current_games[msg.channel.id].state === "replay") state = "Replaying..."
	//initial_text+="\n"+state
	const emb = new Discord.MessageEmbed()
	.setDescription(initial_text)
	.addFields(
		{ name: 'Score', value: current_games[msg.channel.id].stats.score, inline: true },
		{ name: 'Cascades', value: current_games[msg.channel.id].stats.cascades, inline: true },
		{ name: 'Last move', value: current_games[msg.channel.id].stats.last_move.row + " , " +current_games[msg.channel.id].stats.last_move.col, inline: true },
		{ name: 'State', value: state}
	)
	.setAuthor(`Current game created by ${current_games[msg.channel.id].creator.username}`, current_games[msg.channel.id].creator.avatarURL())
	.setFooter(`Last move made by ${current_games[msg.channel.id].stats.last_move.user}`, current_games[msg.channel.id].stats.last_move.user_avatar)
	return emb;
}

function spawn_new_gems(msg){ //spawn new gems after a match happened
	if (current_games[msg.channel.id].state === "replay"){
		const frame = current_games[msg.channel.id].current_replay_frame++
		current_games[msg.channel.id].board = current_games[msg.channel.id].replay[frame]
		if (frame < current_games[msg.channel.id].replay.length-1) {
			current_games[msg.channel.id].current_message.edit(messagify_board(msg, "\n")).then( () => {
				current_games[msg.channel.id].timeout = setTimeout(check_cascade_matches, delay, msg)
			})
		}
		else {
			current_games[msg.channel.id].state = "stable"
			current_games[msg.channel.id].current_replay_frame = 0
			current_games[msg.channel.id].current_message.edit(messagify_board(msg, "\n"))
		}
	}
	else 
	{
		const num_skins = current_games[msg.channel.id].rules.num_skins
		for(let j = 0; j < 8; j++){
			let k_end = 7;
			for(let i = k_end; i >= 0; i--){
				if (current_games[msg.channel.id].board[i][j].skin !== -1) {
					const temp = current_games[msg.channel.id].board[k_end][j]
					current_games[msg.channel.id].board[k_end][j] = current_games[msg.channel.id].board[i][j]
					current_games[msg.channel.id].board[i][j] = temp
					k_end--
				}
			}
			for(let k = 0; k < k_end+1; k++) {
				current_games[msg.channel.id].board[k][j].skin = gem_skins[get_random(num_skins)]
				current_games[msg.channel.id].board[k][j].power = ""
			}
		}
		add_replay_frame(msg)
		current_games[msg.channel.id].current_message.edit(messagify_board(msg, "\n")).then( () => {
			current_games[msg.channel.id].timeout = setTimeout(check_cascade_matches, delay, msg)
		})
	}
}
function check_cascade_matches(msg){ //check if there are cascades after new gems spawned after a match
	if (current_games[msg.channel.id].state === "replay"){
		const frame = current_games[msg.channel.id].current_replay_frame++
		current_games[msg.channel.id].board = current_games[msg.channel.id].replay[frame]
		current_games[msg.channel.id].current_message.edit(messagify_board(msg, "\n")).then( () =>{
			current_games[msg.channel.id].timeout = setTimeout(spawn_new_gems, delay, msg)
		})
	}
	else
	{
		const matches_found = execute_matches(msg, current_games[msg.channel.id].board)
		if (matches_found){
			add_replay_frame(msg)
			current_games[msg.channel.id].stats.cascades++
			current_games[msg.channel.id].current_message.edit(messagify_board(msg, "\n")).then( () =>{
				current_games[msg.channel.id].timeout = setTimeout(spawn_new_gems, delay, msg)
			})
		}
		else
		{
			current_games[msg.channel.id].state = "stable"
			current_games[msg.channel.id].current_message.edit(messagify_board(msg, "\n"))
		}
	}
}
function add_replay_frame(msg){ //add board on last position of replay array
	const len = current_games[msg.channel.id].replay.length
	current_games[msg.channel.id].replay[len] = JSON.parse(JSON.stringify(current_games[msg.channel.id].board))//current_games[msg.channel.id].board.slice()
}
function get_random(end_range) { //find random number between 0 and end_range-1
	return Math.floor(Math.random() * end_range);
}
