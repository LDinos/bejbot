const helptable = require('./../Bot_modules/help_table.json');
const { PermissionsBitField } = require('discord.js');

module.exports = {
	name : ['help', 'list'],
	channel_permissions : 'ALL',
	permission_requirement : PermissionsBitField.Flags.SendMessages,
	async trigger(msg) {
		msg.reply({ content: helptable.help, ephemeral: true });
		// msg.channel.send(helptable.help);
	},
};