module.exports = {
	name : ['info', 'source', 'link', 'code'],
	async trigger(msg) {
		msg.channel.send('I am an open source bot! Find my code at https://github.com/LDinos/bejbot. For list of commands, type +help');
	},
};