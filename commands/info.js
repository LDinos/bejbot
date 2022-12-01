const { PermissionsBitField } = require('discord.js');

module.exports = {
	name : ['info', 'source', 'link', 'code'],
	channel_permissions : 'ALL',
	permission_requirement : PermissionsBitField.Flags.SendMessages,
	async trigger(msg) {
		msg.channel.send('I am an open source bot! Find my code at https://github.com/LDinos/bejbot. For list of commands, type +help');
	},
};