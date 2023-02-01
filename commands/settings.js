/* eslint-disable no-case-declarations */
/* eslint-disable no-inline-comments */
/* eslint-disable no-prototype-builtins */
const { PermissionsBitField } = require('discord.js');
const { EmbedBuilder } = require('discord.js');
module.exports = {
	name : ['settings'],
	channel_permissions : 'ALL',
	permission_requirement : PermissionsBitField.Flags.KickMembers,
	async trigger(msg, args, current_game, current_games, settings, bot) {
		const settings_commands = ['user_info', 'user_give', 'user_set_xp', 'user_kick', 'user_ban', 'ranks', 'add_rank', 'remove_rank', 'change_rank'];
		const settings_commands_info = [
			{name : 'info', arguments : '[user]', description : 'Get info of a user from this server'},
			{name : 'give', arguments : '[user] [role_name_or_id]', description : 'Give role to user'},
			{name : 'set_xp', arguments : '[user] [num]', description : 'Set a user\'s XP points (Note: this will not levelup a user if you give it a higher xp than the role requirement)'},
			{name : 'kick', arguments : '[user]', description : 'Kick a user from this server'},
			{name : 'ban', arguments : '[user]', description : 'Ban a user from this server'},
			{name : 'ranks', arguments : '', description : 'See a list of ranks that can be achieved by getting XP'},
			{name : 'add_rank', arguments : '[role_name_or_id] [xp]', description : 'Add a new rank and its xp requirement to get it'},
			{name : 'remove_rank', arguments : '[role_name_or_id]', description : 'Remove a rank'},
			{name : 'change_rank', arguments : '[role_name_or_id] [xp]', description : 'Change an existing rank\'s XP requirement'},
		]
		/* Wrong argument case */
		let command_error_string = '```\n';
		for(let i = 0; i < settings_commands.length; i++) {
			command_error_string += settings_commands[i] + ' ' + settings_commands_info[i].arguments + ' : ' + settings_commands_info[i].description + '\n';
		}
		command_error_string += '```';
		if (!settings_commands.includes(args[0])) return msg.channel.send(`Unknown argument command for 'settings': ${args[0]}. The list of commands is:\n${command_error_string}`);
		/* */
		let user_member, user_argument, user;
		if (args[0].includes('user')) { // User based commands need to check if user exists
			user_member = msg.mentions.members.first();
			user_argument = user_member?.user;
			if (!user_argument) return msg.channel.send('User argument is either not in the server or non existant! Make sure to mention them.');
			user = settings[msg.guildId].users[user_argument.id]; // See if user is in our database
			if (!user) {
				// Create user in our database for the first time if they weren't in our database
				console.log('User doesn\'t exist in our database, creating it for the first time');
				settings[msg.guildId].users[user_argument.id] = { current_xp : 0 };
				user = settings[msg.guildId].users[user_argument.id];
			}
		}
		let emb;
		switch(args[0]) {
		case 'ranks':
			let text = 'List of ranks and xp requirements: ```';
			for(const rank in settings[msg.guildId].ranks) {
				text += `${rank}: ${settings[msg.guildId].ranks[rank]}\n`;
			}
			text += '```';
			return msg.channel.send(text);
		case 'user_info':
			emb = new EmbedBuilder()
				.setDescription(`${user_argument.username} current xp: ${user.current_xp}`);
			return msg.channel.send({ embeds : [emb] });
		case 'user_give':
			const role = msg.guild.roles.cache.find(r => r.name === args[2] || r.id === args[2]); // Search by name
			if (role == undefined) return msg.channel.send(`${args[2]} role doesn't exist! Be sure to write the name correctly or use the role ID!`); // Still undefined? Then it doesnt exist
			user_member.roles.add(role);
			emb = new EmbedBuilder()
				.setDescription(`Succesfully gave ${role} role to ${user_argument.username}`);
			return msg.channel.send({ embeds : [emb] });
		case 'user_set_xp':
			if (isNaN(args[2])) return msg.channel.send('XP argument must be a number!');
			settings[msg.guildId].users[user_argument.id].current_xp = +args[2];
			emb = new EmbedBuilder()
				.setDescription(`Updated XP of ${user_argument.username} to ${args[2]}`);
			return msg.channel.send({ embeds : [emb] });
		case 'user_kick':
			user_member.kick();
			emb = new EmbedBuilder()
				.setDescription(`Successfully kicked ${user_argument.username}`);
			return msg.channel.send({ embeds : [emb] });
		case 'user_ban':
			user_member.ban();
			emb = new EmbedBuilder()
				.setDescription(`Successfully banned ${user_argument.username}`);
			return msg.channel.send({ embeds : [emb] });
		}
	},
};