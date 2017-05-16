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
var gameIsOver = false;
var disconnectedPlayers = new Array();
var hasReconnected =  false;
var team0;
var team1;
var mapCoordinates;


var host = 'vernemq.evothings.com';
var port = 8084;
var user = 'anon';
var password = 'ymous';
var connected = false;
var ready = false;
var pubTopic;
var subTopic;




//Combine these 2 same thing...
function createGame(gamename, username){ //TODO: PASS IF USER IS ADMIN 
	playerId = username + "-" + Math.random().toString(36).slice(2); // Creates a unique id for each player
	var obj = {
		gamename: gamename,
		playerId: playerId
	}
	localStorage.setItem("adminPlayer", JSON.stringify(obj));

	Game.admin = playerId;
	Game.gameName = gamename;
	init(gamename, username);

}
function joinGame(gamename, username){ 
	if(localStorage.getItem("savedPlayer") && (gamename == JSON.parse(localStorage.getItem("savedPlayer")).gamename)){
		console.log("A player is trying to reconnect");
		playerId = JSON.parse(localStorage.getItem("savedPlayer")).playerId;
		hasReconnected = true;
		$("#gamestart").hide();
	}else{ // todo: disconnect player 
		playerId = username + "-" + Math.random().toString(36).slice(2); 
		var obj = {
			gamename: gamename,
			playerId: playerId
		}
		localStorage.setItem("savedPlayer", JSON.stringify(obj));
		
	}

	Game.gameName = gamename;
	init(gamename, username);
}
/*
	Creates a unique user id
	subscribes to a channel
	sends client information to all other clients
*/
function init(gamename, username){

	console.log("initalize running");
	team0 = Object.create(Team);
	team0.teamId = 0;
    team0.base = {};
    team0.points = 0;
    Game.teams.team0 = team0;
    Game.teams.team0.players = [];
	team1 = Object.create(Team);
	team1.teamId = 1;
    team1.base = {};
    team1.points = 0;
    Game.teams.team1 = team1;
    Game.teams.team1.players = [];
	player.nickname = username;
	player.playerId = playerId;
	player.teamId = 0;
	player.position = {};
	player.caughtPosition = {};
	player.state = State.NORMAL;
	player.insideMap = false;
	
	if (!ready) {
		pubTopic = 'MobileCatchTheFlag/' + Game.gameName + "/" + player.playerId; // We publish to our own device topic
		subTopic = 'MobileCatchTheFlag/' + Game.gameName + "/+";  // We subscribe to all devices using "+" wildcard
		setupConnection();
		ready = true;

	}


}

/*
	FUNCTIONS TO HANDLE SERVER STUFF
*/
function setupConnection() {
	var willMsg = {
		msgType: 9,
		playerId: player.playerId
	}

	status("Connecting to " + host + ":" + port + " as " + player.playerId);
	client = new Paho.MQTT.Client(host, port, player.playerId);
	client.onConnectionLost = onConnectionLost;
	client.onMessageArrived = onMessageArrived;
	console.log(client);
	var finalWill = new Paho.MQTT.Message(JSON.stringify(willMsg));
	finalWill.destinationName = pubTopic;
	var options = {
		useSSL: true,
		onSuccess: onConnect,
		onFailure: onConnectFailure,
		willMessage: finalWill
	}
	client.connect(options);
}


function onConnectMessage(){
	//var playerInfo = Object.create(playerJoinedMsg);
	playerJoinedMsg.playerId = player.playerId;
	playerJoinedMsg.nickname = player.nickname;

	publish(playerJoinedMsg);

	//Get connected players
}

function retainPublish(message) {
	pubMessage = new Paho.MQTT.Message(JSON.stringify(message));
	pubMessage.destinationName = pubTopic;
	pubMessage.retained = true;
	client.send(pubMessage);
};

function publish(message){
	pubMessage = new Paho.MQTT.Message(JSON.stringify(message));
	pubMessage.destinationName = pubTopic;
	client.send(pubMessage);
};

function subscribe(){
	client.subscribe(subTopic);
	console.log("Subscribed: " + subTopic);
}

function unsubscribe(){
	client.unsubscribe(subTopic);
	console.log("Unsubscribed: " + subTopic);
}

function onMessageArrived(message) {
	var msgObj = JSON.parse(message.payloadString);
	switch (msgObj.msgType){
		case 0:

			addToPlayerList(msgObj.nickname, msgObj.playerId);	
			break;
		case 1:
			//received map position
			break;
		case 2: // Player changed team
			if(msgObj.playerId == player.playerId){
				player.teamId = msgObj.teamId;
			}		
			updatePlayerInfo(msgObj.playerId, msgObj.teamId);
			updateTeamUI(msgObj.playerId, msgObj.teamId);
			break;
		case 3: // Flag placements
			console.log("recieved flag placements");
			console.log(msgObj);
			addFlags(msgObj.teamId, JSON.parse(msgObj.flagList));
			break;
		case 4: // Default update msg
			if(!hasReconnected){
				updatePlayerInfo(msgObj.playerId, null, msgObj.position, msgObj.caughtPosition, msgObj.state, msgObj.insideMap, msgObj.carryingFlag);
			}
			 break;
		case 5: // Map info
			mapCoordinates = msgObj.position;
			updateMapInfo(msgObj.position);
			break;
		case 6:
			//freeze someone
			//playerId = enemy
			if (player.playerId == msgObj.playerId){
				youAreFrozenUI();
			}
			updatePlayerInfo(msgObj.playerId, null, null, msgObj.caughtPosition, msgObj.state, null, null);
			break;
		case 7:
			//release someone
			// playerId = friend
			if(!hasReconnected){
				if (player.playerId == msgObj.playerId){
					youAreNotFrozenUI();
				}
				updatePlayerInfo(msgObj.playerId, null, null, null, msgObj.state, null, null);
			}
			break;
		case 8:
			console.log("recieved list of players");
			console.log(msgObj);
			playersConnected = JSON.parse(msgObj.playerList);
			if (!isAdmin()){
				isWaiting=false;
				continueForm($('#pleasewait').get(0));
				console.log("pls add");
				for (var i = 0; i < playersConnected.length; i++){
					addPlayertoFreePlayersListUI(playersConnected[i].nickname, playersConnected[i].playerId);
				}
			}
			break;
		case 9: // A player has disconnected
			if(!hasReconnected){	
				addDisconnectedPlayer(msgObj.playerId);
			}
			break;
			
		case 10:
			if(hasReconnected){
				console.log(msgObj);
			 	Game = JSON.parse(msgObj.game);
				var reconnectMsg ={
					msgType: 16
				}
				publish(reconnectMsg);
			}
			break;
		case 11:
			console.log("Recieved base location");
			console.log(msgObj);
			if(msgObj.teamId === 0){
                var base = Object.create(Base);
                base.teamId = msgObj.teamId;
				base.position = JSON.parse(msgObj.position);
                Game.teams.team0.base = base;
			}else if(msgObj.teamId === 1){
                var base = Object.create(Base);
                base.teamId = msgObj.teamId;
                base.position = JSON.parse(msgObj.position);
                Game.teams.team1.base = base;
			}
			updateBaseInfoUI(msgObj.teamId, msgObj.position);
			break;
		case 12: //A player has reconnected
			if(player.playerId != msgObj.player.playerId){
				console.log("Player is reconnected");
				playersConnected.push(msgObj.player);
				removeDisconnectedPlayer(msgObj.player.playerId);
			}
			break;
		case 13: //Flag has moved
			updateFlagPosition(msgObj.teamId, msgObj.flagId, msgObj.coordinates);
			break;
        case 14: // winning/losing message
            if(msgObj.teamId === player.teamId) {
                youWonUI();
            } else {
                youLostUI();
            }
            break;
        case 15:
            updateTeamPoints(msgObj.teamId, msgObj.points, msgObj.flagId);
            break;
     	case 16:
     		if(!hasReconnected){
				sendUpdatedGameLists();
			}
			break;
		case 17: //Recieved updates lists
			console.log("recieved player update");
			if(hasReconnected){
				console.log(msgObj);
				loadGameState(msgObj);
				hasReconnected = false;
				loadUIStuff();
			}
			break;

	}	
}

function onConnect(context) {
	subscribe();
	status("Connected!");
	connected = true;
	playerJoinedMsg.playerId = player.playerId;
	playerJoinedMsg.nickname = player.nickname;
	publish(playerJoinedMsg);
}

function onConnectFailure(e){
  console.log("Failed to connect: " + JSON.stringify(e));
}

function onConnectionLost (responseObject) {
	//retainPublish(new Byte[0]);
	status("Connection lost!");
	console.log("Connection lost: "+responseObject.errorMessage);
	connected = false;
}

function status (s) {
	console.log("Status update: " + s);
	
}

function loadUIStuff(){
	console.log("loading ui");
	//Team scores
	reloadGameplayUI();
	updateTeamScoreUI(0, Game.teams.team0.points);
	updateTeamScoreUI(1, Game.teams.team1.points);

	//Base
	updateBaseInfoUI(0, JSON.stringify(Game.teams.team0.base.position));
	updateBaseInfoUI(1, JSON.stringify(Game.teams.team1.base.position));
	//Team score
	updateTeamScoreUI(0, Game.teams.team0.points);
	updateTeamScoreUI(1, Game.teams.team1.points);
	//
	updateMapInfoUI(mapCoordinates);

	//Add flags
	
	var friendlyFlagListPositions = [];
	for(var i = 0; i < friendlyFlagList.length; i++){
		friendlyFlagListPositions.push(friendlyFlagList[i].originalPos);
	}

	var enemyFlagListPositions = [];
	for(var i = 0; i < friendlyFlagList.length; i++){
		enemyFlagListPositions.push(enemyFlagList[i].originalPos);
	}

	if(player.teamId == 0){
		addFlagUI(player.teamId, friendlyFlagListPositions);
		addFlagUI(1, enemyFlagListPositions);
	}else{
		addFlagUI(player.teamId, friendlyFlagListPositions);
		addFlagUI(0, enemyFlagListPositions);
	}

	
	


}


function removeDisconnectedPlayer(playerId){
	var tmpArr = []
	for(var i = 0; i < disconnectedPlayers.length; i++){
		if(playerId != disconnectedPlayers[i].playerId){
			tmpArr.push(disconnectedPlayers[i]);
		}
	}
	disconnectedPlayers = tmpArr;
}

function removeConnectedPlayer(playerId){
	var tmpArr = []
	for(var i = 0; i < playersConnected.length; i++){
		console.log(playersConnected[i]);
		if(playerId != playersConnected[i].playerId){
			tmpArr.push(playersConnected[i]);
		}
	}
	playersConnected = tmpArr;
}

function sendUpdatedGameLists(){
	var msg = {
		msgType: 17,
		disconnectedPlayers : disconnectedPlayers,
		friendlyFlagList: friendlyFlagList,
		enemyFlagList: enemyFlagList,
		playersConnected: playersConnected,
		map: mapCoordinates

	}
	console.log(msg);
	publish(msg);
}

/*
	Does a retain publish to save game state
*/
function publishGameInfo(){
	if(isAdmin()){
		var msg = {
			msgType: 10,
			game: JSON.stringify(Game)
			//add base 
		}
		retainPublish(msg);
	}
}

/*
	Load game state if reconnecting
	Go through disconenctedp players until finding correct Id
	populate critical variables
	remove player from disconnected list
	send to all that a players has reconnect succesfully

*/
function loadGameState(msgObj){
	console.log(msgObj);
	console.log("Updating old info");
	console.log(msgObj.disconnectedPlayers);
	for(var i = 0; i < msgObj.disconnectedPlayers.length; i++){
			console.log(player.playerId +  ":  " + msgObj.disconnectedPlayers[i].playerId);
		if(player.playerId == msgObj.disconnectedPlayers[i].playerId){
			console.log("Found disconnected player");
			playersConnected = msgObj.playersConnected;
			friendlyFlagList = msgObj.friendlyFlagList;
			enemyFlagList = msgObj.enemyFlagList;
			playersConnected.push(msgObj.disconnectedPlayers[i].player);
			removeDisconnectedPlayer(player.playerId);
			mapCoordinates = msgObj.map;		
		}
	}
	var msg = { //Send to clients that player has reconnected.
		msgType: 12,
		player: player
	}
	publish(msg);


}

function addDisconnectedPlayer(disconnectedPlayerId){
	for(var i = 0; i < playersConnected.length; i++){
		if(playersConnected[i].playerId === disconnectedPlayerId){
			disconnectedPlayers.push(playersConnected[i]);
			removeConnectedPlayer(disconnectedPlayerId);
			console.log("Added " + disconnectedPlayerId + " to disconnected list");
		}
	}

}


function updatePlayerInfo(playerId, teamId, position, caughtPosition, state, insideMap, carryingFlag){
	if(playerId==null){
		console.log("Player id must be passed to id the player");
	}else{
		for(i = 0; i < playersConnected.length;i++){
			if(playersConnected[i].playerId == playerId){
				if(teamId){
					playersConnected[i].teamId = teamId;
				}
				if(position){
					playersConnected[i].position = position;
					updatePlayerPosition(playerId, position);

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
                if(playerId === player.playerId) {
                    player = playersConnected[i];
                    inbase();
                }
				break;
			}
		}
	}
}


function createTeams(){
	for(i = 0; i < playersConnected.length; i++){
		if(playersConnected[i].teamId == 0){
			Game.teams.team0.players.push(playersConnected[i]);
		}else{
			Game.teams.team1.players.push(playersConnected[i]);
		}
	}

}

function updateTeamPoints(teamId, points, flagId) {
    if(teamId === 0) {
        Game.teams.team0.points = points;
    } else {
        Game.teams.team1.points = points;
    }
    removeFlag(teamId,flagId);
    youDontHaveTheFlagUI();
    updateTeamScoreUI(teamId, points);
}


/*
	Creates player object and adds to list of connected players
*/
function addToPlayerList(playerName, playerId){
	if(player.playerId == Game.admin){
		var newplayer = Object.create(Player);
		newplayer.nickname = playerName;
		newplayer.playerId = playerId;
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

function addFlags(teamId, flagList){
	var flagId1 = 0;
	var flagId2 = 0;
	console.log(flagList);
	for(i = 0; i < flagList.length; i++){
		var newFlag = Object.create(Flag);
		
		newFlag.teamId = teamId;
		newFlag.originalPos = flagList[i];
		
		if(newFlag.teamId == player.teamId){
			newFlag.flagId = flagId1;
			flagId1++;
			friendlyFlagList.push(newFlag);
		}else{
			newFlag.flagId = flagId2;
			flagId2++;
			enemyFlagList.push(newFlag);
		}
	}	
	addFlagUI(teamId, flagList);
}


/*
	Methods to call for sending messages
*/

function pubFlagUpdate(teamId ,flagId, coordinates){
	flagMsg.teamId = teamId;
	flagMsg.flagId = flagId;
	flagMsg.coordinates = coordinates;
	publish(flagMsg);
}


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
	baseMsg.position = JSON.stringify(coordinates);
	baseMsg.teamId = player.teamId;
	publish(baseMsg);
}

function pubTeamChoice(movedPlayerId,teamId){
	playerJoinedTeam.playerId = movedPlayerId;
	playerJoinedTeam.teamId = teamId;
	publish(playerJoinedTeam);
}

function pubMapPosition(coordinates){
	mapInfoMsg.position = coordinates;
	publish(mapInfoMsg);
}

function pubFlagPosition(flagList){
	console.log(flagList);
	var msg = {
		msgType: 3,
		flagList: JSON.stringify(flagList),
		teamId: player.teamId
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

function pubWinningTeam(teamId) {
    var msg = {
        msgType: 14,
        teamId: teamId
    }
    publish(msg);
}

function pubTeamPoints(teamId, points, flagId) {
    var msg = {
        msgType: 15,
        teamId: teamId,
        points: points,
        flagId: flagId
    };
    publish(msg);
}

function isAdmin(){
	return (player.playerId === Game.admin);
}

function updateMapInfo(coordinates){
	updateMapInfoUI(coordinates);
}
