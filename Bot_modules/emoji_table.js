//Get a skin number and convert it to emoji ID

module.exports = function ConvertToEmoji(number)
{
	let emoji;
	switch(number)
	{
		case 'r':
		case '0':
			emoji = "<:red:335099342430011393>";
			break;
		case 'w':
		case '1':
			emoji = "<:white:335097856471859211>";
			break;
		case 'g':
		case '2':
			emoji = "<:green:335083184242819082>";
			break;
		case 'y':
		case '3':
			emoji = "<:yellow:335099367235256321>";
			break;
		case 'p':
		case '4':
			emoji = "<:purple:335093968889184266>";
			break;
		case 'o':
		case '5':
			emoji = "<:orange:335086460527181824>";
			break;
		case 'b':
		case '6':
			emoji = "<:blue:335075204474863617>";
			break;
		case 'rf':
		case '0f':
		case '10':
			emoji = "<:red_f:344231837473964035>";
			break;
		case 'wf':
		case '1f':
		case '11':
			emoji = "<:white_f:344231837662445579>";
			break;
		case 'gf':
		case '2f':
		case '12':
			emoji = "<:green_f:344231827210240003>";
			break;
		case 'yf':
		case '3f':
		case '13':
			emoji = "<:yellow_f:344231837280894976>";
			break;
		case 'pf':
		case '4f':
		case '14':
			emoji = "<:purple_f:344231836844818433>";
			break;
		case 'of':
		case '5f':
		case '15':
			emoji = "<:orange_f:344231837511450625>";
			break;
		case 'bf':
		case '6f':
		case '16':
			emoji = "<:blue_f:344231822860877834>";
			break;
		case 'rl':
		case '0l':
		case '20':
			emoji = "<:red_l:336679509883486229>";
			break;
		case 'wl':
		case '1l':
		case '21':
			emoji = "<:white_l:336679538832572418>";
			break;
		case 'gl':
		case '2l':
		case '22':
			emoji = "<:green_l:336679488987332608>";
			break;
		case 'yl':
		case '3l':
		case '23':
			emoji = "<:yellow_l:336679553923678208>";
			break;
		case 'pl':
		case '4l':
		case '24':
			emoji = "<:purple_l:336679501696204811>";
			break;
		case 'ol':
		case '5l':
		case '25':
			emoji = "<:orange_l:336679495362936832>";
			break;
		case 'bl':
		case '6l':
		case '26':
			emoji = "<:blue_l:336679473028268033>";
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
