const helptable = require('./../Bot_modules/help_table.json');

module.exports = {
	name : ['help', 'list'],
	async trigger(msg) {
		msg.channel.send(helptable.help);
	},
};