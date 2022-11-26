const { spawn_new_gems, messagify_board, delay } = require('./../Bot_modules/shared_functions');

module.exports = {
	name : ['replay'],
	async trigger(msg, args, current_game) {
		if (current_game !== undefined && current_game.state !== 'stable') return;
		if (current_game !== undefined) {
			if (current_game.replay.length !== 0) {
				current_game.board = current_game.replay[0];
				current_game.state = 'replay';
				msg.channel.send({ embeds: [messagify_board(current_game, '\n')] }).then(msg_sent =>{
					current_game.current_message = msg_sent;
					current_game.current_replay_frame++;
					current_game.timeout = setTimeout(spawn_new_gems, delay, current_game);
				});
			}
			else {msg.channel.send('No moves were made for replay to work here');}
		}
		else {msg.channel.send('No game is created in this channel! Use ```+start_game```');}
	},
};