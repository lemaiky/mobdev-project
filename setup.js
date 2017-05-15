/*
TODO LIST:
	get info about who is admin
*/
var player = Object.create(Player);
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
	// Create a unique username from input
	/*
	if(localStorage.getItem("playerId")){
		console.log("Exists cookie");
		//get playerId value from cookie
		//playerId = getFromcookie
	}else{
		//Create cookie with playerId
		console.log("Exists no cookie");
		playerId = username + "-" + Math.random().toString(36).slice(2); // Creates a unique id for each player
	  	localStorage.setItem("playerId", playerId);
	  	console.log(localStorage.getItem("playerId"));
	}
	*/
	playerId = username + "-" + Math.random().toString(36).slice(2); // Creates a unique id for each player
	Game.admin = playerId;
	init(gamename, username);

}
function joinGame(gamename, username){
	playerId = username + "-" + Math.random().toString(36).slice(2); 
	init(gamename, username);
}
/*
	Creates a unique user id
	subscribes to a channel
	sends client information to all other clients
*/
function init(gamename, username){

	Game.gameName = gamename;
	
	pubnub_channel = "MobileCatchTheFlag";

    player.nickname = username;
    player.playerId = playerId;
    player.teamId = 0;
    player.position = {};
    player.caughtPosition = {};
    player.state = State.NORMAL;
    player.insideMap = false;

	pubnub.setUUID(playerId);

	console.log("is now trying to subscribe");
	pubnub.subscribe({
    	channels: [pubnub_channel],
    	restore: true,
    	disconnect :function(){
    		console.log("disconnected")
    	}
	});
}

function onConnectMessage(){
	//var playerInfo = Object.create(playerJoinedMsg);
	playerJoinedMsg.playerId = playerId;
	playerJoinedMsg.nickname = player.nickname;

	publish(playerJoinedMsg);

	//Get connected players
}

function publish(msg){
	console.log("sending msg: ");
	console.log(msg);
	var pubConfig = {
		channel: pubnub_channel,
		message: msg
	}
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
        	console.log(msgObj);
        	console.log("recieved map position");
        

        }else if(msgObj.msgType == 2){	//player joined team
        	console.log("recieved team info");
        	console.log(msgObj);
        	updatePlayerInfo(msgObj.playerId, msgObj.teamId);
        	updateTeamUI(msgObj.playerId, msgObj.teamId);
        	//Call function to show player in team

        }else if(msgObj.msgType == 3){	//flag placements
        	console.log("recieved flag placements");
        	console.log(msgObj);
        	addFlags(JSON.parse(msgObj.flagList));

        }else if(msgObj.msgType == 4){
        	 console.log("default update msg");
        	 console.log(msgObj);
        	 if(caughtPosition != null){
        	 	updatePlayerInfo(msgObj.playerId, null, msgObj.position, msgObj.caughtPosition, msgObj.state, msgObj.insideMap, msgObj.carryingFlag);
        	 }else{
        	 	updatePlayerInfo(msgObj.playerId, null, msgObj.position, null, msgObj.state, msgObj.insideMap, msgObj.carryingFlag);
        	 }
        	 
        }else if(msgObj.msgType == 5){
        	console.log("recieved map info");
        	console.log(msgObj);
        	updateMapInfo(msgObj.position);
        	// Add map info somehow
        } else if(msgObj.msgType == 6){
            //freeze someone
            //playerId = enemy
            updatePlayerInfo(msgObj.playerId, null, null, msgObj.caughtPosition, msgObj.state, null, null);
        } else if(msgObj.msgType == 7){
            //release someone
            // playerId = friend
            updatePlayerInfo(msgObj.playerId, null, null, null, msgObj.state, null, null);
        } else if(msgObj.msgType == 8){
        	console.log("recieved list of players");
        	console.log(msgObj);
        	playersConnected = JSON.parse(msgObj.playerList);
        	if (!isAdmin()){
        		console.log("pls add");
        		for (var i = 0; i < playersConnected.length; i++){
        			addPlayertoFreePlayersListUI(playersConnected[i].nickname, playersConnected[i].playerId);
        		}
        	}
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
	}else{
		for(i = 0; i < playersConnected.length;i++){
			if(playersConnected[i].playerId == playerId){
				if(playersConnected[i].teamId != teamId){
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
                if(playerId == player.playerId) {
                    player = playersConnected[i];
                }
				break;	
			}
		}
	}
}
/*
	Creates player object and adds to list of connected players
*/
function addToPlayerList(playerName, newPlayerId){
	if(player.playerId == Game.admin){
		var newplayer = Object.create(Player);
		newplayer.nickname = playerName;
		newplayer.playerId = newPlayerId;
		newplayer.teamId = 0;
		newplayer.position = {};
		newplayer.caughtPosition = {};
		newplayer.state= State.NORMAL;
		newplayer.insideMap = false;
		playersConnected.push(newplayer);
		addPlayertoFreePlayersListUI(newplayer.nickname, newplayer.playerId);

		console.log(playersConnected);
	}
}
/*
	Adds flags to list of flags :)
*/

function addFlags(flagList){
	for(var i = 0; flagList.length; i++){
		var newFlag = Object.create(Flag);
		cFlag.flagId = flagList[i].flagId;
		cFlag.teamId = flagList[i].teamId;
		cFlag.originalPos = flagList[i].originalPos;
		if(teamId){
			friendlyFlagList.push(cFlag);
		}else{
			enemyFlagList.push(cFlag);
		}
	}
	
}


/*
	Methods to call for sending messages
*/
function pubRegularUpdate(playerId, position, caughtPosition, state, carryingFlag, flagId){
	updateMsg.playerId = playerId;
	updateMsg.position = position;
	updateMsg.caughtPosition = caughtPosition;
	updateMsg.state = state;
	updateMsg.carryingFlag = carryingFlag;
	updateMsg.flagId = flagId;
	publish(updateMsg); 

}

function pubBasePosition(coordinates){
	baseMsg.position = coordinates;
	publish(baseMsg);
}

function pubTeamChoice(movedPlayerId,teamId){
	playerJoinedTeam.playerId = movedPlayerId;
	playerJoinedTeam.teamId = teamId;
	publish(playerJoinedTeam);
}

function pubMapPosition(coordinates){
	baseMsg.position = coordinates;
	publish(baseMsg);
}

function pubFlagPosition(coordinates, teamId, flagId){
	var msg = {
		msgType: 3,
		flagList: JSON.stringify(flagList)
	}
	publish(msg);
}



function pubFreezeEnemy(playerId, caughtPosition, state) {
    var msg = {
        msgType: 6,
        playerId: playerId,
        caughtPosition: caughtPosition,
        state: state
    };
    publish(msg);
}

function pubReleaseFriend(playerId, state) {
    var msg = {
        msgType: 7,
        playerId: playerId,
        state: state
    };
    publish(msg);
}

function pubPlayerList(){
	var msg = {
		msgType: 8,
		playerList: JSON.stringify(playersConnected)
	}
	publish(msg);
}


function isAdmin(){
	return (player.playerId === Game.admin);
}
function updateMapInfo(coordinates){
	updateMapInfoUI(coordinates);
}

