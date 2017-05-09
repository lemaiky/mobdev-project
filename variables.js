var State = {FLAG, CAUGHT, RELEASED, RELEASING};

var allGames = [];

var Game = {
	gameId,
	teams: [],
	admin
	// game id
	// 2 teams
	// game admin
}

var Team = {
	teamId,
	players: [],
	base: {},
	flags: [],
	points,
	leader
	// team id
	// list of player ids
	// base
	// list of flag ids
	// points
	// team leader
}

var Player = {
	nickname,
	playerId,
	teamId,
	position: {},
	caughtPosition: {},
	state,
	insideMap
	// nickname
	// player id
	// team id
	// position: {lat, long}
	// caught position: {lat, long}
	// state
	// inside/outside map (bool)
	//leader
}

var Flag = {
	flagId,
	position: {},
	teamId,
	originalPos: {},
	caught = false
	// flag id
	// position: {lat, long}
	// team id
	// original location: {lat, long}
	// caught (bool)
}

var Base = {
	teamId,
	position: {}
	// team id
	// position: {lat, long}
}



/*
 assigning to team
 teamId
 playerID


 map to draw /recieve
 mapPosition


 flagPlacements
 array of flags
 


 normal msg
 player id
 location
 state
 flagId
 caughtPosition






*/