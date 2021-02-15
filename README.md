# Running the bot
- You need an auth.json file that uses the bot authentication code which is hidden in the [Discord Developer Portal](https://discord.com/developers/applications) page of your application. 
```json
{
"token": "<put your token here>"
}
```
- You install the dependencies ```node install```
- You run the bot by typing ```node bot```
- You need textures for command ```+board_image``` to work by creating a folder in ```Bot_modules/textures/``` and inserting png textures of the gems (64x64) depending on the colors and their power . For example, a green gem must be in a ```g.png``` file in the textures folder. A green flame gem must be ```gf.png```. A lightning green gem must be ```gl.png``` and a green Supernova is ```gs.png```. 
- You also need a ```Bot_modules/textures/board.png``` (512x512) for the board in the background. 


|Colors|Powers|
|-|-|
|g (Green)|f (Flame)|
|r (Red)|l (Lightning)|
|y (Yellow)|s (Supernova)|
|o (Orange)|
|p (Purple)|
|b (Blue)|
|w (White)|
|-any- (Empty)

# Code Structure
- ```bot.js```: The main code of the bot. Holds all commands and their behaviour
- ```emoji_table.js```: A list of character strings that are read from the user when using command ```+board``` that get converted to an emoji string so that emojis are visible in the final message
- ```letter_table.js```: Similarly, the same happens with letters when using the ```+say``` command. Each character is converted to an emoji using this file
- ```imagecreator.js```: Code that creates an image depending on what the user wrote in ```+board_image``` command.
- ```board_template.json```: A template game structure for when starting a game with ```+start_game```. Each channel has its own game
- ```emoji_help```: Help string for a discord user when using ```+board```
- ```help_table```: List of all commands for a discord user that used ```+help```

# Discord Channel
<a href="https://discord.gg/jSj2uKB">
<img src="https://cdn.icon-icons.com/icons2/2108/PNG/512/discord_icon_130958.png" alt="Discord" width="64"/>
</a>
Are you a Bejeweled enthusiast? Join us in the Bejeweled Fans Server!
https://discord.gg/jSj2uKB

# Donations
If you want to support me and want to throw money at me, you can donate to my paypal here: https://www.paypal.me/LDinos

