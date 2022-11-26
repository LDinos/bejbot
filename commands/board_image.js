/* eslint-disable max-statements-per-line */
/* eslint-disable no-inline-comments */
const emoji_help = require('./../Bot_modules/emoji_help.json');
const { message_create_board_array } = require('./../Bot_modules/shared_functions');
const { create_board_image } = require('./../Bot_modules/imagecreator');
module.exports = {
	name : ['board_image'],
	async trigger(msg, args) {
		if (args.length === 0) {msg.channel.send(emoji_help.help); return;}
		const splitted_msg = msg.content.slice(12).trim().split('\n'); // 12 = +board_image command length (With prefix)
		const board = message_create_board_array(splitted_msg);
		await create_board_image(board);
		await msg.channel.send({ files: ['image.png'] });
	},
};