/* eslint-disable no-inline-comments */
/* eslint-disable max-statements-per-line */
const { messagify_board, initialize_board } = require('./../Bot_modules/shared_functions');
const fs = require('fs');
module.exports = {
	name : ['start', 'start_game', 'restart', 'play'],
	async trigger(msg, args, current_game, current_games) {
		if (current_game !== undefined) return msg.channel.send('You must first finish the current game with ```+stop_game```');
		const jsonfile = fs.readFileSync('./Bot_modules/board_template.json');
		const template = JSON.parse(jsonfile);
		current_game = current_games[msg.channel.id] = template;
		current_game.creator = msg.author;
		if (args.length === 1) {

			if (!isNaN(args[0]) && args[0] < 8 && args[0] > 2) {args[0] = Math.trunc(args[0]); current_game.rules.num_skins = args[0];}
			else {msg.channel.send('Argument must be a number from 3 to 7. Setting game to 7 skins by default:');}
		}
		current_game.board = initialize_board(current_game, 8, 8);
		const emb = messagify_board(current_game, '\n');
		msg.channel.send({ embeds : [emb] });
	},
};