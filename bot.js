/* eslint-disable no-prototype-builtins */
/* eslint-disable prefer-const */
/* eslint-disable no-unused-vars */
/* eslint-disable comma-dangle */
/* eslint-disable indent */
/* eslint-disable max-statements-per-line */
/* eslint-disable no-case-declarations */
/* eslint-disable quotes */
/* eslint-disable no-inline-comments */

const { Discord, Client, GatewayIntentBits, PermissionsBitField, EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');
const auth = require('./auth.json');
const { increase_xp, check_for_levelup, update_settings_file, update_settings_fileSync } = require('./Bot_modules/moderator_funcs');
const settings = fs.existsSync('./current_settings.json') ? require('./current_settings.json') : require('./default_settings.json');
let current_games = {};
let autosave_interval;
const prefix = '+';
const commandsPath = path.join(__dirname, "commands");
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
const commands = [];
for(const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    commands.push(command);
}

// Initialize Discord Bot
const bot = new Client({
	intents: [GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildPresences,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.GuildMembers,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.DirectMessages]
});
bot.login(auth.token);

process.addListener("SIGINT", stopEvent);
process.addListener("SIGTERM", stopEvent);

function stopEvent() {
	clearInterval(autosave_interval);
	console.log('Exiting and autosaving...');
	update_settings_fileSync(settings);
	process.exit();
  }

bot.on('ready', () => {
	console.log("Welcome Back");
	autosave_interval = setInterval(() => update_settings_file(settings), 1000 * 15);
});

bot.on('guildMemberAdd', member => { // When a new person joins the server
	if (!settings[member.guild.id].users.hasOwnProperty(member.user.id)) {
		settings[member.guild.id].users[member.user.id] = { current_xp : 0 };
	}
	const welcome = settings[member.guild.id].welcome_message;
	const welcome_channel = settings[member.guild.id].welcome_channel_id;
	const welcome_embed = new EmbedBuilder()
	.setTitle(`Welcome ${member.user.username}!`)
	.setDescription(`${member.user} ${welcome}`)
	.setThumbnail(member.user.displayAvatarURL());
    member.guild.channels.cache.get(welcome_channel).send({ content : `${member.user}`, embeds : [welcome_embed] });
});

bot.on('guildMemberRemove', member => { // When a person leaves the server
	const welcome_channel = settings[member.guild.id].welcome_channel_id;
    member.guild.channels.cache.get(welcome_channel).send({ content : `${member.user.username} has left the server.` });
});

bot.on('messageCreate', async msg => {
	if (msg.guild === null) return msg.channel.send("I can't be used in DMs!"); // Cant be used in DM
	if (!msg.content.startsWith(prefix) || msg.author.bot) {
		// TODO: XP SYSTEM HERE
		if (msg.author.bot) return;
		if (!settings[msg.guildId].users.hasOwnProperty(msg.author.id)) { // First ever xp
			settings[msg.guildId].users[msg.author.id] = { current_xp : 1 };
		}
		else {
			increase_xp(settings, msg.guildId, msg.member, msg.channel);
			check_for_levelup(settings, msg.guild, msg.member);
			update_settings_file(settings);
		}
		return;
	}
	const args = msg.content.slice(prefix.length).trim().split(/ +/); // returns the arguments after the command, eg '+swap 1 1 left' will return [1, 1, left]
	let command = args.shift().toLowerCase();
	const lineIndex = command.indexOf('\n');
	command = command.slice(0, lineIndex === -1 ? undefined : lineIndex); // returns the command, eg '+swap 1 1 left' will return "swap"
	return run_command(command, msg, args);
});

function run_command(command, msg, args) {
	const specific_channels = settings[msg.guildId].specific_channels; // Channels that commands with SPECIFIC permissions can be writen into
	let current_game = current_games[msg.channel.id];
	for(const cmd_data of commands) {
		for(const cmd_name of cmd_data.name) {
			if (command === cmd_name) {
				if (!msg.member.permissions.has(cmd_data.permission_requirement)) {
					msg.reply('You do not have the appropriate permissions to use this command.');
					return console.log(`${msg.member.user.username} is trying to use moderator command`); // Does the user have the permission to type this command?
				}
				if (cmd_data.channel_permissions === 'SPECIFIC') { // Does the bot have permission to type in this channel?
					// Administrators can use bot commands in any channel
					if (!specific_channels.includes(msg.channel.id) && !msg.member.permissions.has(PermissionsBitField.Flags.Administrator)) return; // If we are not allowed to write this command in this channel, don't say anything
				}
				return cmd_data.trigger(msg, args, current_game, current_games, settings, bot);
			}
		}
	}

	if (specific_channels.includes(msg.channel.id)) return msg.channel.send(`Can't understand, ${msg.author}`);
	return;
}