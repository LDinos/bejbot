const fs = require('fs');
module.exports = {
	increase_xp(settings, guild_id, user, channel) {
		const naughty_ranks = settings[guild_id].naughty_ranks;
		const unrankable_channels = settings[guild_id].unrankable_channels;
		if (unrankable_channels.includes(channel.name)) return;
		// Do NOT rank up if we are in the naughty list
		if (user.roles.cache.some(role => !naughty_ranks.includes(role.name))) {
			settings[guild_id].users[user.id].current_xp++;
		}
	},
	check_for_levelup(settings, guild, user) {
		const xp = settings[guild.id].users[user.id].current_xp;
		const ranks = settings[guild.id].ranks;
		let index = 0;
		for (const i in ranks) {
			const role_names = Object.getOwnPropertyNames(ranks);
			const rank_xp = ranks[i];
			if (xp === rank_xp) {
				const role = guild.roles.cache.find(r => r.name == role_names[index]);
				if (!role) {
					return console.log(`Role not found: ${role_names[index]}`);
				}
				else {
					try {
						user.roles.add(role);
						const text = `${user.user.username} has been promoted to ${role.name}!`;
						const channel = settings[guild.id].logs_channel_id;
						guild.channels.cache.get(channel)?.send({ embeds : [text] });
						console.log(text);
					}
					catch (error) {
						console.error(error);
					}
				}
			}
			index++;
		}
	},
	update_settings_file(settings) {
		const json = JSON.stringify(settings, null, 4);
		fs.writeFile('./current_settings.json', json, 'utf8', err => {
			if (err) console.log(err);
			// else console.log('Autosaved settings file!');
		});
	},
	update_settings_fileSync(settings) {
		const json = JSON.stringify(settings, null, 4);
		fs.writeFileSync('./current_settings.json', json, 'utf8', err => {
			if (err) console.log(err);
			// else console.log('Autosaved settings file!');
		});
	},
	log_write(settings, guild, text) {
		const channel = settings[guild.id].logs_channel_id;
		guild.channels.cache.get(channel).send({ embeds : [text] });
	},
};