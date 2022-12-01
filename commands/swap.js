/* eslint-disable no-inline-comments */
const { spawn_new_gems, messagify_board, delay, check_swap_command, execute_matches, add_replay_frame } = require('./../Bot_modules/shared_functions');
const { PermissionsBitField } = require('discord.js');

module.exports = {
	name : ['swap'],
	channel_permissions : 'SPECIFIC',
	permission_requirement : PermissionsBitField.Flags.SendMessages,
	async trigger(msg, args, current_game) {
		if (current_game !== undefined && current_game.state !== 'stable') return;
		if (args.length === 3) {
			args[0] = Math.trunc(args[0]);
			args[1] = Math.trunc(args[1]);
			const xcoord = args[1] - (args[2] === 'left') + (args[2] === 'right');
			const ycoord = args[0] - (args[2] === 'up') + (args[2] === 'down');
			const canswap = check_swap_command(current_game, args, xcoord, ycoord);
			if (canswap === 'Swap okay') {
				let gem1 = current_game.board[args[0] - 1][args[1] - 1];
				current_game.board[args[0] - 1][args[1] - 1] = current_game.board[ycoord - 1][xcoord - 1];
				current_game.board[ycoord - 1][xcoord - 1] = gem1;
				current_game.stats.cascades = 0;
				const matches_found = execute_matches(current_game, current_game.board);
				if (matches_found === 0) { // swap back
					gem1 = current_game.board[args[0] - 1][args[1] - 1];
					current_game.board[args[0] - 1][args[1] - 1] = current_game.board[ycoord - 1][xcoord - 1];
					current_game.board[ycoord - 1][xcoord - 1] = gem1;
					msg.channel.send('No matches found with that swap!');
				}
				else {
					current_game.stats.cascades = 1;
					current_game.state = 'moving';
					current_game.stats.last_move.user = msg.author.username;
					current_game.stats.last_move.user_avatar = msg.author.avatarURL();
					current_game.stats.last_move.row = args[0];
					current_game.stats.last_move.col = args[1];
					msg.channel.send({ embeds: [messagify_board(current_game, '\n')] }).then(msg_sent =>{
						current_game.current_message = msg_sent;
						current_game.replay = [];
						add_replay_frame(current_game);
						current_game.timeout = setTimeout(spawn_new_gems, delay, current_game);
					});
				}
			}
			else {msg.channel.send(canswap);}
		}
		else {msg.channel.send('Command format is ```+swap [row] [column] [left/right/up/down]```');}
	},
};