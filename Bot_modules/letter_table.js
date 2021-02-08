//Get a skin number and convert it to emoji ID

module.exports = function ConvertToLetterEmoji(number)
{
	let emoji;
	switch(number)
	{
		case 'a':
			emoji = "<:BejLetterA:641877929374253077>"
		break;
		case 'b':
			emoji = "<:BejLetterB:641867554322776066>"
		break;
		case 'c':
			emoji = "<:BejLetterC:641872039996555264>"
		break;
		case 'd':
			emoji = "<:BejLetterD:641867552229949440>"
		break;
		case 'e':
			emoji = "<:BejLetterE:699847822807138354>"
		break;
		case 'f':
			emoji = "<:BejLetterF:641932184256512020>"
		break;
		case 'g':
			emoji = "<:BejLetterG:641871163429093387>"
		break;
		case 'h':
			emoji = "<:BejLetterH:641886200864440320>"
		break;
		case 'i':
			emoji = "<:BejLetterI:641874799987130370>"
		break;
		case 'j':
			emoji = "<:BejLetterJ:641867552045137951>"
		break;
		case 'k':
			emoji = "<:BejLetterK:641935658985979904>"
		break;
		case 'l':
			emoji = "<:BejLetterL:641867551596478465>"
		break;
		case 'm':
			emoji = "<:BejLetterM:641872039971389470>"
		break;
		case 'n':
			emoji = "<:BejLetterN:641875386787168276>"
		break;
		case 'o':
			emoji = "<:BejLetterO:641871162900742165>"
		break;
		case 'p':
			emoji = "<:BejLetterP:641872039728119829>"
		break;
		case 'q':
			emoji = "<:BejLetterQ:641943343659614208>"
		break;
		case 'r':
			emoji = "<:BejLetterR:641872039933902863>"
		break;
		case 's':
			emoji = "<:BejLetterS:641874586488799232>"
		break;
		case 't':
			emoji = "<:BejLetterT:641872039996686376>"
		break;
		case 'u':
			emoji = "<:BejLetterU:641880192058523658>"
		break;
		case 'v':
			emoji = "<:BejLetterV:641878871972511754>"
		break;
		case 'w':
			emoji = "<:BejLetterW:641874238428413952>"
		break;
		case 'x':
			emoji = "<:BejLetterX:641929961359278091>"
		break;
		case 'y':
			emoji = "<:BejLetterY:641886786515107843>"
		break;
		case 'z':
			emoji = "<:BejLetterZ:641876187760689162>"
		break;
		default:
			emoji = number;
			break; 
	}
	return emoji;
}

//export {ConvertToEmoji};
