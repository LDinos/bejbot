// const current_games = require('./../bot.js');
module.exports = {
	name : ['stop', 'stop_game'],
	channel_permissions : 'SPECIFIC',
	async trigger(msg, args, current_game, current_games) {
		if (current_game !== undefined) {
			// if (current_game.creator === msg.author || msg.member.hasPermission('MANAGE_MESSAGES')){
			if (current_game.timeout !== undefined) clearTimeout(current_game.timeout);
			delete current_games[msg.channel.id];
			msg.channel.send('Game is destroyed');
			// }
			// else msg.channel.send(`Only moderators/admins or the game creator ${current_game.creator.username} can stop the current game`)
		}
		else {msg.channel.send('No current games found to stop!');}
	},
};