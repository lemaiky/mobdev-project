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
var gameIsOver = true;
var disconnectedPlayers = new Array();
var hasReconnected =  false;


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
	localStorage.setItem("savedPlayer", JSON.stringify(obj));

	Game.admin = playerId;
	Game.gameName = gamename;
	init(gamename, username);

}
function joinGame(gamename, username){ 
/*
	if(localStorage.getItem("savedPlayer") && (gamename == JSON.parse(localStorage.getItem("savedPlayer")).gamename)){
		playerId = JSON.parse(localStorage.getItem("savedPlayer")).playerId;
		hasReconnected = true;
	}else{ // todo: disconnect player 
		playerId = username + "-" + Math.random().toString(36).slice(2); 
		var obj = {
			gamename: gamename,
			playerId: playerId
		}
		localStorage.setItem("savedPlayer", JSON.stringify(obj));
		
	}
*/
	playerId = username + "-" + Math.random().toString(36).slice(2); 
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
			 if(caughtPosition != null){
				updatePlayerInfo(msgObj.playerId, null, msgObj.position, msgObj.caughtPosition, msgObj.state, msgObj.insideMap, msgObj.carryingFlag);
			 }else{
				updatePlayerInfo(msgObj.playerId, null, msgObj.position, null, msgObj.state, msgObj.insideMap, msgObj.carryingFlag);
			 }
			 break;
		case 5: // Map info
			updateMapInfo(msgObj.position);
			break;
		case 6:
			//freeze someone
			//playerId = enemy
			updatePlayerInfo(msgObj.playerId, null, null, msgObj.caughtPosition, msgObj.state, null, null);
			break;
		case 7:
			//release someone
			// playerId = friend
			updatePlayerInfo(msgObj.playerId, null, null, null, msgObj.state, null, null);
			break;
		case 8:
			console.log("recieved list of players");
			console.log(msgObj);
			playersConnected = JSON.parse(msgObj.playerList);
			if (!isAdmin()){
				console.log("pls add");
				for (var i = 0; i < playersConnected.length; i++){
					addPlayertoFreePlayersListUI(playersConnected[i].nickname, playersConnected[i].playerId);
				}
			}
			break;
		case 9: // A player has disconnected
			addDisconnectedPlayer(msgObj.playerId);
			break;
			
		case 10:
			if(hasReconnected){
				loadGameState(msgObj);
			}
			break;
		case 11:
			console.log("Recieved base location");
			if(msgObj.teamId == 0){
				Game.teams.team0.base.teamId = msgObj.teamId;
				Game.teams.team0.base.position = msgObj.position;
			}else{
				Game.teams.team1.base.teamId = msgObj.teamId;
				Game.teams.team1.base.position = msgObj.position;
			}
			updateBaseInfoUI(msgObj.teamId, msgObj.position);
			break;
		case 12: //A player has reconnected
			playersConnected.push(JSON.parse(msgObj.player));
			break;
		case 13: //Flag has moved
			updateFlagPosition(msgObj.teamId, msgObj.flagId, JSON.parse(msgObj.coordinates));
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
/*
	Does a retain publish to save game state
*/
function publishGameInfo(){
	var msg = {
		msgType: 9,
		game: JSON.stringify(Game),
		playerList: JSON.stringify(playersConnected),
		friendlyFlagList: friendlyFlagList,
		enemyFlagList: enemyFlagList,
		disconnectedPlayers: disconnectedPlayers
		//add base 
	}
	retainPublish(msg);
}

/*
	Load game state if reconnecting
*/
function loadGameState(msgObj){
	disconnectedPlayers = JSON.parse(msgObj.disconnectedPlayers);
	for(var i = 0; i < disconnectedPlayers.length; i++){
		if(player.playerId == disconnectedPlayers[i].playerId){
			console.log("Found disconnected player");
			Game = JSON.parse(msgObj.game);
			playersConnected = JSON.parse(msgObj.playerList);
			friendlyFlagList = JSON.parse(msgObj.friendlyFlagList);
			enemyFlagList = JSON.parse(msgObj.enemyFlagList);
			playersConnected.push(disconnectedPlayers[i]);
			player = disconnectedPlayers[i];
			disconnectedPlayers.remove(i);
		}
	}
	var msg = {
		msgType: 12,
		player: JSON.stringify(player)
	}
	publish(msg);


}

function addDisconnectedPlayer(disconnectedPlayerId){
	for(var i = 0; i < playersConnected.length; i++){
		if(playersConnected[i].playerId === disconnectedPlayerId){

			disconnectedPlayers.push(playersConnected[i]);
			playersConnected.remove(i);
			console.log("Added " + disconnectedPlayerId + " to disconnected list");
		}
	}

}


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
				break;	
			}
		}
	}
}


function createTeams(){
	var team0 = Object.create(Team);
	team0.teamId = 0;
	var team1 = Object.create(Team);
	team1.teamId = 1;

	for(i = 0; i < playersConnected.length; i++){
		if(playersConnected[i].teamId == 0){
			team0.players.push(playersConnected[i]);
		}else{
			team1.players.push(playersConnected[i]);
		}
	}
	Game.teams = {team0, team1};

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
	for(i = 0; i < flagList.length; i++){
		var newFlag = Object.create(Flag);
		newFlag.flagId = i;
		newFlag.teamId = teamId;
		newFlag.originalPos = flagList[i];
		console.log(newFlag.teamId);
		if(newFlag.teamId == player.teamId){
			friendlyFlagList.push(newFlag);
		}else{
			enemyFlagList.push(newFlag);
		}
	}
	
	addFlagUI(teamId, flagList);
}


/*
	Methods to call for sending messages
*/

function newFlagPosition(teamId ,flagId, coordinates){
	//which array do we update?
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


function isAdmin(){
	return (player.playerId === Game.admin);
}

function updateMapInfo(coordinates){
	updateMapInfoUI(coordinates);
}
