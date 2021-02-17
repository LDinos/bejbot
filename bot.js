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
	if (debug && msg.channel.id !== Bejeweled_Test) return msg.channel.send("I am being developed in a very secret channel right now, so you can't use me at the moment!")
	if (msg.guild === null) return msg.channel.send("I can't be used in DM's")
	if (!msg.guild.me.permissionsIn(msg.channel).has('MANAGE_CHANNELS')) return msg.channel.send("I can't be used here! Maybe try the channels that were made for me?")

	const args = msg.content.slice(prefix.length).trim().split(/ +/); //returns the arguments after the command, eg '+swap 1 1 left' will return [1, 1, left]
	let command = args.shift().toLowerCase();
	const lineIndex = command.index('\n');
	command = command.slice(0, lineIndex === -1 ? undefined : lineIndex) //returns the command, eg '+swap 1 1 left' will return "swap"
	console.log(command)

	let current_game = current_games[msg.channel.id];

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
			for(let arg of args){
				for(let char of arg){
					final_msg += ConvertToLetter(char.toLowerCase())+ " "
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
			if (current_game !== undefined) msg.channel.send(messagify_board(current_game, "\n"))
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
			if (current_game !== undefined && current_game.state !== "stable") return;
			if (current_game !== undefined){
				if (current_game.replay.length !== 0){
					current_game.board = current_game.replay[0]
					current_game.state = "replay"
					msg.channel.send(messagify_board(current_game, "\n")).then(msg_sent =>{
						current_game.current_message = msg_sent
						current_game.current_replay_frame++
						current_game.timeout = setTimeout(spawn_new_gems,delay,current_game)
					})
				}
				else msg.channel.send("No moves were made for replay to work here")
			}
			else msg.channel.send("No game is created in this channel! Use ```+start_game```")
			break;
		case 'stop_game':
		case 'stop':
			if (current_game !== undefined){
				//if (current_game.creator === msg.author || msg.member.hasPermission('MANAGE_MESSAGES')){
					if (current_game.timeout !== undefined) clearTimeout(current_game.timeout)
					delete current_games[msg.channel.id]
					msg.channel.send("Game is destroyed")
				//}
				//else msg.channel.send(`Only moderators/admins or the game creator ${current_game.creator.username} can stop the current game`)
			}
			else msg.channel.send("No current games found to stop!")
			break;
		case 'start_game':
		case 'start':
		case 'restart':
		case 'play':
			if (current_game !== undefined) return msg.channel.send("You must first finish the current game with ```+stop_game```")
			let jsonfile = fs.readFileSync('./Bot_modules/board_template.json');
			const template = JSON.parse(jsonfile);
			current_game = current_games[msg.channel.id] = template
			current_game.creator = msg.author
			if (args.length === 1){
				
				if (!isNaN(args[0]) && args[0] < 8 && args[0] > 2) {args[0] = Math.trunc(args[0]); current_game.rules.num_skins = args[0]}
				else msg.channel.send("Argument must be a number from 3 to 7. Setting game to 7 skins by default:")
			}
			current_game.board = initialize_board(current_game, 8, 8)
			let return_message = messagify_board(current_game, "\n"); 
			msg.channel.send(return_message)
			break;
		case 'swap':
			if (current_game !== undefined && current_game.state !== "stable") return;
			if (args.length === 3){
				args[0] = Math.trunc(args[0])
				args[1] = Math.trunc(args[1])
				var xcoord = args[1] - (args[2] === "left") + (args[2] === "right")
				var ycoord = args[0] - (args[2] === "up") + (args[2] === "down")
				const canswap = check_swap_command(current_game, args, xcoord, ycoord)
				if (canswap === "Swap okay"){
					let gem1 = current_game.board[args[0]-1][args[1]-1]
					current_game.board[args[0]-1][args[1]-1] = current_game.board[ycoord-1][xcoord-1]
					current_game.board[ycoord-1][xcoord-1] = gem1

					let matches_found = execute_matches(current_game, current_game.board)
					if (matches_found === 0){ //swap back
						gem1 = current_game.board[args[0]-1][args[1]-1]
						current_game.board[args[0]-1][args[1]-1] = current_game.board[ycoord-1][xcoord-1]
						current_game.board[ycoord-1][xcoord-1] = gem1
						msg.channel.send("No matches found with that swap!")
					}
					else {
						current_game.stats.cascades = 1
						current_game.state = "moving"
						current_game.stats.last_move.user = msg.author.username
						current_game.stats.last_move.user_avatar = msg.author.avatarURL()
						current_game.stats.last_move.row = args[0]
						current_game.stats.last_move.col = args[1]
						msg.channel.send(messagify_board(current_game, "\n")).then(msg_sent =>{
							current_game.current_message = msg_sent
							current_game.replay = []
							add_replay_frame(current_game)
							current_game.timeout = setTimeout(spawn_new_gems,delay,current_game)
						})
					}
				}
				else msg.channel.send(canswap)
			} else msg.channel.send("Command format is ```+swap [row] [collumn] [left/right/up/down]```")
			break;
		default: msg.channel.send(`Can't understand, ${msg.author}`); break;
	}
});

function initialize_board(current_game, rows, cols) { //Create board for the first time
	const num_skins = current_game.rules.num_skins
	let board;
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

function check_swap_command(current_game, args, xcoord, ycoord){ //check if swapping is possible
	if (current_game !== undefined){
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

function execute_matches(current_game, board){ //find matches and destroy the gems that got matched
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
	for(let row of message) //gem rows (if u write two rows of g g, this will return ['g g', 'g g'])
	{
		let array = [];
		let i_start = 0;
		for(let i = 0; i < row.length; i++) //each character from each row (for example from the first row we get ['g', 'g'])
		{
			if (row[i] !== " ")
			{
				let m = row[i]
				let p = ""
				let cont = false
				if (i !== row.length-1) { //if we are not at the end of the row message
					if (row[i+1] !== " ") { //and the character after this is not empty (=power)
						p = row[i+1]; //get the power
						cont = true //and make j++ since we checked two characters at once
					}
				}
				array[i_start] = {skin : m, power : p}
				i_start++
				if (cont) i++
			}
		}

		board_array.push(array);
	}
	return board_array;
}
function message_get_board(message){ //create an emoji board string depending on what the user has written (used in +board)
	let msg_returned =""
	for(let row of message) //gem rows
	{
		for(let i = 0; i < row.length; i++) //each row character
		{
			if (row[i] !== " ")
			{
				let m = row[i]
				if (i !== row.length-1) if (row[i+1] !== " ") {m += row[i+1]; i++}
				msg_returned += ConvertToEmoji(m);
			}
			else msg_returned += " "
		}
		msg_returned += "\n"
	}
	return msg_returned;
}

function messagify_board(current_game, initial_text){ //Take all gems and write them in a message format string
	for(let i = 0; i < 8; i++){
		initial_text += "\n"
		for(let j = 0; j < 8; j++){
			const gem = current_game.board[i][j]
			initial_text += ConvertToEmoji(gem.skin + gem.power) + " "
		}
	}
	let state = "Ready!"
	if (current_game.state === "moving") state = "Standby..."
	else if (current_game.state === "replay") state = "Replaying..."
	//initial_text+="\n"+state
	const emb = new Discord.MessageEmbed()
	.setDescription(initial_text)
	.addFields(
		{ name: 'Score', value: current_game.stats.score, inline: true },
		{ name: 'Cascades', value: current_game.stats.cascades, inline: true },
		{ name: 'Last move', value: current_game.stats.last_move.row + " , " +current_game.stats.last_move.col, inline: true },
		{ name: 'State', value: state}
	)
	.setAuthor(`Current game created by ${current_game.creator.username}`, current_game.creator.avatarURL())
	.setFooter(`Last move made by ${current_game.stats.last_move.user}`, current_game.stats.last_move.user_avatar)
	return emb;
}

function spawn_new_gems(current_game){ //spawn new gems after a match happened
	if (current_game.state === "replay"){
		const frame = current_game.current_replay_frame++
		current_game.board = current_game.replay[frame]
		if (frame < current_game.replay.length-1) {
			current_game.current_message.edit(messagify_board(current_game, "\n")).then( () => {
				current_game.timeout = setTimeout(check_cascade_matches, delay, current_game)
			})
		}
		else {
			current_game.state = "stable"
			current_game.current_replay_frame = 0
			current_game.current_message.edit(messagify_board(current_game, "\n"))
		}
	}
	else 
	{
		const num_skins = current_game.rules.num_skins
		for(let j = 0; j < 8; j++){
			let k_end = 7;
			for(let i = k_end; i >= 0; i--){
				if (current_game.board[i][j].skin !== -1) {
					const temp = current_game.board[k_end][j]
					current_game.board[k_end][j] = current_game.board[i][j]
					current_game.board[i][j] = temp
					k_end--
				}
			}
			for(let k = 0; k < k_end+1; k++) {
				current_game.board[k][j].skin = gem_skins[get_random(num_skins)]
				current_game.board[k][j].power = ""
			}
		}
		add_replay_frame(current_game)
		current_game.current_message.edit(messagify_board(current_game, "\n")).then( () => {
			current_game.timeout = setTimeout(check_cascade_matches, delay, current_game)
		})
	}
}
function check_cascade_matches(current_game){ //check if there are cascades after new gems spawned after a match
	if (current_game.state === "replay"){
		const frame = current_game.current_replay_frame++
		current_game.board = current_game.replay[frame]
		current_game.current_message.edit(messagify_board(current_game, "\n")).then( () =>{
			current_game.timeout = setTimeout(spawn_new_gems, delay, current_game)
		})
	}
	else
	{
		const matches_found = execute_matches(current_game, current_game.board)
		if (matches_found){
			add_replay_frame(current_game)
			current_game.stats.cascades++
			current_game.current_message.edit(messagify_board(current_game, "\n")).then( () =>{
				current_game.timeout = setTimeout(spawn_new_gems, delay, current_game)
			})
		}
		else
		{
			current_game.state = "stable"
			current_game.current_message.edit(messagify_board(current_game, "\n"))
		}
	}
}
function add_replay_frame(current_game){ //add board on last position of replay array
	const len = current_game.replay.length
	current_game.replay[len] = JSON.parse(JSON.stringify(current_game.board))//current_game.board.slice()
}
function get_random(end_range) { //find random number between 0 and end_range-1
	return Math.floor(Math.random() * end_range);
}
