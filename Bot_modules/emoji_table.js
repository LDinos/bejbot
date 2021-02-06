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
		case '10':
			emoji = "<:red_f:344231837473964035>";
			break;
		case 'wf':
		case '11':
			emoji = "<:white_f:344231837662445579>";
			break;
		case 'gf':
		case '12':
			emoji = "<:green_f:344231827210240003>";
			break;
		case 'yf':
		case '13':
			emoji = "<:yellow_f:344231837280894976>";
			break;
		case 'pf':
		case '14':
			emoji = "<:purple_f:344231836844818433>";
			break;
		case 'of':
		case '15':
			emoji = "<:orange_f:344231837511450625>";
			break;
		case 'bf':
		case '16':
			emoji = "<:blue_f:344231822860877834>";
			break;
		case 'rl':
		case '20':
			emoji = "<:red_f:344231837473964035>";
			break;
		case 'wl':
		case '21':
			emoji = "<:white_l:336679538832572418>";
			break;
		case 'gl':
		case '22':
			emoji = "<:green_l:336679488987332608>";
			break;
		case 'yl':
		case '23':
			emoji = "<:yellow_l:336679553923678208>";
			break;
		case 'pl':
		case '24':
			emoji = "<:purple_l:336679501696204811>";
			break;
		case 'ol':
		case '25':
			emoji = "<:orange_l:336679495362936832>";
			break;
		case 'bl':
		case '26':
			emoji = "<:blue_l:336679473028268033>";
			break;
		case 'rs':
		case '30':
			emoji = "<:red_supernova:587982588694757376>";
			break;
		case 'ws':
		case '31':
			emoji = "<:white_supernova:587982588531048469>";
			break;
		case 'gs':
		case '32':
			emoji = "<:green_supernova:587982589302669330>";
			break;
		case 'ys':
		case '33':
			emoji = "<:yellow_supernova:587982589625630720>";
			break;
		case 'ps':
		case '34':
			emoji = "<:purple_supernova:587982589625892864>";
			break;
		case 'os':
		case '35':
			emoji = "<:orange_supernova:587982591228116992>";
			break;
		case 'bs':
		case '36':
			emoji = "<:blue_supernova:587982588468133892>";
			break;
		case 'e':
			emoji = "<:skullgem:585744824507039754>"
			break;
		default:
			if (number < 0) emoji = "<:empty:693409154324234240>"; //empty
			else emoji = ":question:"; //????
			break;
	}
	return emoji;
}

//export {ConvertToEmoji};
