var State = {FLAG, CAUGHT, RELEASED, RELEASING};

var allGames = new Array();

var Game = {
	// game id
	// 2 teams
	// game admin
}

var Team = {
	// team id
	// list of player ids
	// base
	// list of flag ids
	// points
	// team leader
}

var Player = {
	// nickname
	// player id
	// team id
	// position: {lat, long}
	// caught position: {lat, long}
	// state
	// inside/outside map (bool)
}

var Flag = {
	// flag id
	// position: {lat, long}
	// team id
	// original location: {lat, long}
	// caught (bool)
}

var Base = {
	// team id
	// position: {lat, long}
}