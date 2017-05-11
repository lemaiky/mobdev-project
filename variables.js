var State = {NORMAL:0, FLAG:1, CAUGHT:2, RELEASED:3, RELEASING:4};

var allGames = [];

var Game = {
	gameId:0,
	teams: {}, // array of 2 teams
	admin:""
}

var Team = {
	teamId:0,
	players: [],
	base: {},
	flags: [],
	points:0,
	leader:0
	// team id
	// list of player ids
	// base
	// list of flag ids
	// points
	// team leader
}

var Player = {
	nickname:"",
	playerId:0,
	teamId:0,
	position: {},
	caughtPosition: {},
	state:State.NORMAL,
	insideMap: true
	//carryingFlag: false
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
	flagId:0,
	position: {},
	teamId:0,
	originalPos: {},
	caught: false,
	holdingPlayerId:0
	// flag id
	// position: {lat, long}
	// team id
	// original location: {lat, long}
	// caught (bool)
}

var Base = {
	teamId:0,
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
	nickname:"",
	playerId:0
}

var mapPositionMsg = {
	msgType: 1

}

var playerJoinedTeam ={
	msgType: 2,
	nickname:"", 
	playerId:0,
	teamId:0
}

var flagPlacementsMsg = {
	msgType: 3
}

var updateMsg = {
	msgType: 4,
	playerId:0,
	position: {},
	caughtPosition: {},
	state: State.NORMAL,
	carryingFlag:false
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