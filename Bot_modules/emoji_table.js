//Get a skin number and convert it to emoji ID

module.exports = function ConvertToEmoji(number)
{
	let emoji;
	switch(number)
	{
		case 'r':
		case '0':
			emoji = "<:g_red:656288336520019969>";
			break;
		case 'w':
		case '1':
			emoji = "<:g_white:656288336683728897>";
			break;
		case 'g':
		case '2':
			emoji = "<:g_green:656288329809264640>";
			break;
		case 'y':
		case '3':
			emoji = "<:g_yellow:656288336956358698>";
			break;
		case 'p':
		case '4':
			emoji = "<:g_purple:656288336796712960>";
			break;
		case 'o':
		case '5':
			emoji = "<:g_orange:656288333382549557>";
			break;
		case 'b':
		case '6':
			emoji = "<:g_blue:656288328362229772>";
			break;
		case 'rf':
		case '0f':
		case '10':
			emoji = "<:red_f:807921680609181726>";
			break;
		case 'wf':
		case '1f':
		case '11':
			emoji = "<:white_f:807921680609181726>";
			break;
		case 'gf':
		case '2f':
		case '12':
			emoji = "<:green_f:807921680609181726>";
			break;
		case 'yf':
		case '3f':
		case '13':
			emoji = "<:yellow_f:807921680609181726>";
			break;
		case 'pf':
		case '4f':
		case '14':
			emoji = "<:purple_f:807921680609181726>";
			break;
		case 'of':
		case '5f':
		case '15':
			emoji = "<:orange_f:807921680609181726>";
			break;
		case 'bf':
		case '6f':
		case '16':
			emoji = "<:blue_f:807921680609181726>";
			break;
		case 'rl':
		case '0l':
		case '20':
			emoji = "<:red_l:344231837473964035>";
			break;
		case 'wl':
		case '1l':
		case '21':
			emoji = "<:white_l:807922527627378689>";
			break;
		case 'gl':
		case '2l':
		case '22':
			emoji = "<:green_l:807922527627378689>";
			break;
		case 'yl':
		case '3l':
		case '23':
			emoji = "<:yellow_l:807922527627378689>";
			break;
		case 'pl':
		case '4l':
		case '24':
			emoji = "<:purple_l:807922527627378689>";
			break;
		case 'ol':
		case '5l':
		case '25':
			emoji = "<:orange_l:807922527627378689>";
			break;
		case 'bl':
		case '6l':
		case '26':
			emoji = "<:blue_l:807922527627378689>";
			break;
		case 'rs':
		case '0s':
		case '30':
			emoji = "<:red_supernova:587982588694757376>";
			break;
		case 'ws':
		case '1s':
		case '31':
			emoji = "<:white_supernova:587982588531048469>";
			break;
		case 'gs':
		case '2s':
		case '32':
			emoji = "<:green_supernova:587982589302669330>";
			break;
		case 'ys':
		case '3s':
		case '33':
			emoji = "<:yellow_supernova:587982589625630720>";
			break;
		case 'ps':
		case '4s':
		case '34':
			emoji = "<:purple_supernova:587982589625892864>";
			break;
		case 'os':
		case '5s':
		case '35':
			emoji = "<:orange_supernova:587982591228116992>";
			break;
		case 'bs':
		case '6s':
		case '36':
			emoji = "<:blue_supernova:587982588468133892>";
			break;
		case 'e':
			emoji = "<:skullgem:807850471242465310>"
			break;
		default:
			if (number < 0) emoji = "<:empty:693409154324234240>"; //empty
			else emoji = ":question:"; //????
			break;
	}
	return emoji;
}

//export {ConvertToEmoji};
