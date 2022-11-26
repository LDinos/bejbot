const ConvertToLetter = require('./../Bot_modules/letter_table');

module.exports = {
	name : ['say', 'text'],
	channel_permissions : 'SPECIFIC',
	async trigger(msg, args) {
		let final_msg = '';
		for(const arg of args) {
			for(const char of arg) {
				final_msg += ConvertToLetter(char.toLowerCase()) + ' ';
			}
			final_msg += ' ';
		}
		msg.channel.send(final_msg).catch(err => {
			if (err) msg.channel.send('Message is too long to write!');
			else msg.channel.send(final_msg);
		});
	},
};