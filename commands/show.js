const { messagify_board } = require('./../Bot_modules/shared_functions');

module.exports = {
	name : ['show', 'show_board'],
	channel_permissions : 'SPECIFIC',
	async trigger(msg, args, current_game) {
		if (current_game !== undefined) msg.channel.send({ embeds: [messagify_board(current_game, '\n')] });
		else msg.channel.send('No games are present. Use ```+start_game```');
	},
};