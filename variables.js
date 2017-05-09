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
	insideMap,
	carryingFlag
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
	caught: false
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

/** MSGs WE ARE SENDING **\

	0 : informing players a new player is joined
	1 : informs players of map posiiton
	2 : informs players that a player join team #
	3 : informs players of flag placements
	4 : the general update 



**/


var playerJoinedMsg = {
	msgType: 0,
	nickname,
	playerId
}

var mapPositionMsg = {
	msgType: 1

}

var playerJoinedTeam ={
	msgType: 2
	nickname, 
	playerId,
	teamId
}

var flagPlacementsMsg = {
	msgType: 3
}

var updateMsg = {
	msgType: 4,
	playerId,
	position: {},
	caughtPosition: {},
	state,
	carryingFlag
}

/*
	Msg types:
	0 = telling users 




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