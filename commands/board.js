/* eslint-disable max-statements-per-line */
/* eslint-disable no-inline-comments */
const emoji_help = require('./../Bot_modules/emoji_help.json');
const { message_get_board } = require('./../Bot_modules/shared_functions');

module.exports = {
	name : ['board'],
	async trigger(msg, args) {
		if (args.length === 0) {msg.channel.send(emoji_help.help); return;}
		const splitted_msg = msg.content.slice(6).trim().split('\n'); // 6 = +board command length (With prefix)
		const msg_returned = message_get_board(splitted_msg);
		msg.channel.send(msg_returned).catch(err =>{
			if (err) msg.channel.send('Message is too long to write!');
			else msg.channel.send(msg_returned);
		});
	},
};