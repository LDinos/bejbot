const helptable = require('./../Bot_modules/help_table.json');

module.exports = {
	name : ['help', 'list'],
	channel_permissions : 'ALL',
	async trigger(msg) {
		msg.reply({ content: helptable.help, ephemeral: true });
		// msg.channel.send(helptable.help);
	},
};