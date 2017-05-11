/*
TODO LIST:
	get info about who is admin
*/
var playerName;
var playerId;  //Unqiue user id from username
var pubnub_channel; //Publish channel
var playerTeamId; // THIS Client team id
var playersConnected = new Array(); //List of players connected
var friendlyFlagList = new Array(); //List of flag objects 
var enemyFlagList = new Array(); //List of flag objects 


var pubnub = new PubNub({ //Keys
		publishKey: config.PUB_KEY,
		subscribeKey: config.SUB_KEY,
		sss: true
})


//Combine these 2 same thing...
function createGame(gamename, username){ //TODO: PASS IF USER IS ADMIN 
	// Create a unique username from inpu
	init(gamename, username);

}
function joinGame(gamename, username){
	init(username, gamename);
}
/*
	Creates a unique user id
	subscribes to a channel
	sends client information to all other clients
*/

function init(gamename, username){
	Game.gameName = gamename;
	playerName = username;
	playerId = username + "-" + Math.random().toString(36).slice(2); // Creates a unique id for each player
	pubnub_channel = "MobileCatchTheFlag";

	pubnub.setUUID(playerId);

	console.log("is now trying to subscribe");
	pubnub.subscribe({
    	channels: [pubnub_channel]
	});
}

function onConnectMessage(){
	//var playerInfo = Object.create(playerJoinedMsg);
	playerJoinedMsg.playerId = playerId;
	playerJoinedMsg.nickname = playerName;

	publish(playerJoinedMsg);
}

function publish(msg){
	console.log("sending msg" + msg);
	var pubConfig = {
		channel: pubnub_channel,
		message: msg
	}
	console.log(pubConfig);
	pubnub.publish(pubConfig, function(status, response){
		console.log(status, response);
	})
}


pubnub.addListener({
    status: function(statusEvent) {
    	console.log(statusEvent);
        if (statusEvent.category === "PNConnectedCategory") {
            onConnectMessage(); //If connected; sends msg to all clients that a new client has joined

        } else if (statusEvent.category === "PNUnknownCategory") {
            var newState = {
                new: 'error'
            };
            pubnub.setState(
                {
                    state: newState 
                },
                function (status) {
                    console.log(statusEvent.errorData.message)
                }
            );
        } 
    },
    /*
		Handles all messages
    */
    message: function(msg) {
        var msgObj = msg.message;
        if(msgObj.msgType == 0){ // player info
        	console.log("recieved player info");
        	console.log(msgObj);
        	addToPlayerList(msgObj.nickname, msgObj.playerId);

        }else if(msgObj.msgType == 1){	//map posiiton
        	console.log("recieved map position");

        }else if(msgObj.msgType == 2){	//player joined team
        	console.log("recieved team info");
        	updatePlayerInfo(msg.playerId, msg.teamId, null, null, null, null);

        }else if(msgObj.msgType == 3){	//flag placements
        	console.log("recieved flag placements");
        	if()
        	addFlags(msgObj);

        }else if(msgObj.msgType == 4){
        	 console.log("default update msg");
        	 if(caughtPosition != null){
        	 	updatePlayerInfo(msgObj.playerId, null, msgObj.position, msgObj.caughtPosition, msgObj.state, msgObj.insideMap, msgObj.carryingFlag);
        	 }else{
        	 	updatePlayerInfo(msgObj.playerId, null, msgObj.position, null, msgObj.state, msgObj.insideMap, msgObj.carryingFlag);
        	 }
        	 
        }else if(msgObj.msgType == 5){
        	console.log("recieved map info");
        	// Add map info somehow
        }
    }
})
/*
	Input: playerID must be passed to id the player
	Optional: teamId, position, caughtPosition, state, insideMap
*/
function updatePlayerInfo(playerId, teamId, position, caughtPosition, state, insideMap, carryingFlag){
	if(!playerId){
		console.log("Player id must be passed to id the player");
		break;
	}
	for(i = 0; i < playersConnected.length;i++){
		if(playersConnected[i].playerId == playerId){
			if(teamId){
				playersConnected[i].teamId = teamId;
			}
			if(position){
				playersConnected[i].position = position;

			}
			if(caughtPosition){
				playersConnected[i].caughtPosition = caughtPosition;
			}
			if(state){
				playersConnected[i].state = state;
			}
			if(insideMap){
				playersConnected[i].insideMap = insideMap;
			}
			if(carryingFlag){
				playersConnected[i].carryingFlag = carryingFlag;
			}
			break;	
		}
	}
}
/*
	Creates player object and adds to list of connected players
*/
function addToPlayerList(playerName, playerId){
	var player = Object.create(Player);
	player.nickname = playerName;
	player.playerId = playerId;
	player.teamId = 0;
	player.position = {};
	player.caughtPosition = {};
	player.state= State.NORMAL;
	player.insideMap = false;
	playersConnected.push(player);

	console.log(playersConnected);
}
/*
	Adds flags to list of flags :)
*/
function addFlags(){
	var cFlag = Object.create(Flag);
	cFlag.flagId = flagId;
	cFlag.teamId = teamId;
	cFlag.originalPos = {'lat': originalPos.lat, 'lng': originalPos.lng}
	if(teamId)
	friendlyFlagList.push(cFlag);

	enemyFlagList.push(cFlag);
}


/*

	Methods to call for sending messages

var updateMsg = {
	msgType: 4,
	playerId:0,
	position: {},
	caughtPosition: {},
	state: State.NORMAL,
	carryingFlag:false
}



*/

function pubRegularUpdate(playerId, position, caughtPosition, state, carryingFlag, flagId){
	//fix

}


function pubBasePosition(coordinates){
	baseMsg.position = coordinates;
	publish(baseMsg);
}


function pubTeamChoice(teamId){
	playerJoinedTeam.playerId = playerId;
	playerJoinedTeam.nickname = nickname;
	playerJoinedTeam.teamId = teamId;
	publish(playerJoinedTeam);
}

function pubMapPosition(coordinates){
	/// Dunno how these coordinates look
}
function pubFlagPosition(coordinates, teamId){
	Flag.teamId = teamId;
	Flag.originalPos = coordinates
	publish(Flag);
}


