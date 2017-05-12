/*
	var playerName;
	var playerId;  //Unqiue user id from username
	var playerTeamId; // THIS Client team id
	var playersConnected = new Array(); //List of players connected
	var friendlyFlagList = new Array(); //List of flag objects 
	var enemyFlagList = new Array(); //List of flag objects 
*/

function grab() {
	if(state === State.CAUGHT) {
		return;
	}

	// check all flags
	for(var i = 0; i < enemyFlagList.length; ++i) {
		var flag = enemyFlagList[i];
		if(inradius(flag)) {
			flag.caught = true;
			flag.holdingPlayerId = playerId;
			state = State.FLAG;
			break;
		}
	}
}

function release() {
	if(state === State.CAUGHT) {
		return;
	}

	var friend;
	// check all friends
	for(var i = 0; i < playersConnected.length; ++i) {
		if(playersConnected[i].teamId != playerTeamId)
			continue;

		friend = playersConnected[i];
		if(friend.state === State.CAUGHT && inradius(friend)) {
			// send message to release friend
			break;
		}
	}
}

function freezeEnemy() {
	var enemy;
	// check all enemies
	for(var i = 0; i < playersConnected.length; ++i) {
		if(playersConnected[i].teamId === playerTeamId)
			continue;

		enemy = playersConnected[i];
		if (enemy.state != State.RELEASED && inradius(enemy)) {
			if(enemy.state === State.FLAG) {
				resetFlag(enemy);
			}
			// send a message to freeze the player
			break;
		}
	}
	wait(5000);
}

function incourt() {
	// own position
	var lat = Player.position.lat;
	var lng = Player.position.lng;

	/*if (position outside court) {
		wait(15000);
	}*/
}

function inbase() {
	var base;
	if(inradius(base)) {
		switch(state) {
			case State.RELEASED:
				unlockPosition();
				break;
			case State.FLAG:
				winningFlag();
				break;
			default:
				break;
		}
	}
}

function inradius(obj) {
	// own position
	var lat = Player.position.lat;
	var lng = Player.position.lng;

	// to replace with obj.position
	var objLat = obj.position['lat'];
	var objLng = obbj.position['lng'];

	var R = 6371e3; // metres
	var latDiff = lat - objLat;
	var lngDiff = lng - objLng;

	var a = Math.sin(latDiff/2) * Math.sin(latDiff/2) +
	        Math.cos(lat) * Math.cos(objLat) *
	        Math.sin(lngDiff/2) * Math.sin(lngDiff/2);
	var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
	var d = R * c;

	if(d <= 10) {
		console.log("inside radius " + d)
		return true;
	} else {
		console.log("outside radius " + d);
		return false;
	}
}

function isWinning(teamId) {
	if(Game.teams[teamId].points === 5) {
		// show winning page on teams[teamId]
		// show losing page on teams[enemyId]
	}
	// else continue the game
}

function resetFlag(enemy) {
	for(var i = 0; friendlyFlagList.length; ++i) {
		var flag = friendlyFlagList[i];
		if(flag.caught && flag.holdingPlayerId === enemy.playerId) {
			flag.position = flag.originalPos;
			flag.caught = false;
			flag.holdingPlayerId = 0;
			break;
		}
	}
}

function winningFlag() {
	var enemyTeamId;
	for(var i = 0; enemyFlagList.length; ++i) {
		var flag = enemyFlagList[i];
		if(flag.caught && flag.holdingPlayerId === playerId) {
			// flag disappears from the other team's side
			//teams[teamId].points += 1;
			state = State.NORMAL;
			isWinning(playerTeamId);
			break;
		}
	}
}

function unlockPosition() {
	state = State.NORMAL;
	caughtPosition = {};
}

// oneself being caught
function beingReleased() {
	if(position === caughtPosition) {
		state = State.RELEASED;
		alert('go back to your base');
	} else {
		alert("you need to be at your caught position");
	}
}

function frozen() {
	state = State.CAUGHT;
	caughtPosition = position;
	alert('stop moving');
}