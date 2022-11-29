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
let current_games = {};
const prefix = '+';
const Bejeweled_Test = "1042582468097749022";
const specific_channels = [Bejeweled_Test, "808740551414513725", "808740184652120105", "808740229166923777", "410255110170607632"]; // Channels that commands with SPECIFIC permissions can be writen to

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
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.DirectMessages]
});
bot.login(auth.token);

bot.on('ready', () => {
	console.log("Welcome Back");
	// bot.channels.fetch(Bejeweled_Test).then(channel => {channel.send("Welcome Back!")})
});

bot.on('messageCreate', async msg => {
	if (!msg.content.startsWith(prefix) || msg.author.bot) return; // dont do anything if the message doesn't start with the prefix
	// if (debug && msg.channel.id !== Bejeweled_Test) return msg.channel.send("I am being developed in a very secret channel right now, so you can't use me at the moment!");
	if (msg.guild === null) return msg.channel.send("I can't be used in DMs!"); // Cant be used in DM because of the line below us
	// if (!msg.guild.members.me.permissions.has('MANAGE_CHANNELS')) return; //	msg.channel.send("I can't be used here! Maybe try the channels that were made for me?"); // TODO: make it not get an error when checking permissions of the guild if used in DM's.
	const args = msg.content.slice(prefix.length).trim().split(/ +/); // returns the arguments after the command, eg '+swap 1 1 left' will return [1, 1, left]
	let command = args.shift().toLowerCase();
	const lineIndex = command.indexOf('\n');
	command = command.slice(0, lineIndex === -1 ? undefined : lineIndex); // returns the command, eg '+swap 1 1 left' will return "swap"
	return run_command(command, msg, args);
});

function run_command(command, msg, args) {
	let current_game = current_games[msg.channel.id];
	for(const cmd_data of commands) {
		for(const cmd_name of cmd_data.name) {
			if (command === cmd_name) {
				if (cmd_data.channel_permissions === 'SPECIFIC') {
					if (!specific_channels.includes(msg.channel.id)) return; // If we are not allowed to write this command in this channel, don't say anything
				}
				return cmd_data.trigger(msg, args, current_game, current_games);
			}
		}
	}

	if (specific_channels.includes(msg.channel.id)) return msg.channel.send(`Can't understand, ${msg.author}`);
	return; // msg.channel.send(`Can't understand, ${msg.author}`);
}