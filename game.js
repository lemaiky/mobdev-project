/*
	var player;
	var playerId;  //Unqiue user id from username
	var playerTeamId; // THIS Client team id
	var playersConnected = new Array(); //List of players connected
	var friendlyFlagList = new Array(); //List of flag objects 
	var enemyFlagList = new Array(); //List of flag objects 
*/

function grab() {
	if(player.state === State.CAUGHT) {
		return;
	}

	// check all flags
	for(var i = 0; i < enemyFlagList.length; ++i) {
		var flag = enemyFlagList[i];
		if(inradius(flag)) {
			flag.caught = true;
			flag.holdingPlayerId = player.playerId;
			player.state = State.FLAG;
			break;
		}
	}
}

function release() {
	if(player.state === State.CAUGHT) {
		return;
	}

	var friend;
	// check all friends
	for(var i = 0; i < playersConnected.length; ++i) {
		if(playersConnected[i].teamId != player.teamId)
			continue;

		friend = playersConnected[i];
		if(friend.position === friend.caughtPosition && friend.state === State.CAUGHT && inradius(friend)) {
			// send message to release friend
			pubReleaseFriend(friend.playerId, State.RELEASED);
			break;
		}
	}
}

function freezeEnemy() {
	var enemy;
	// check all enemies
	for(var i = 0; i < playersConnected.length; ++i) {
		if(playersConnected[i].teamId === player.teamId)
			continue;

		enemy = playersConnected[i];
		if (enemy.state != State.RELEASED && inradius(enemy)) {
			if(enemy.state === State.FLAG) {
				resetFlag(enemy);
			}
			// send a message to freeze the player
			pubFreezeEnemy(enemy.playerId, player.position, State.CAUGHT);
			break;
		}
	}
	wait(5000);
}

function incourt() {
	// own position
	var lat = player.position['lat'];
	var lng = player.position['lng'];

	/*if (position outside court) {
		wait(15000);
	}*/
}

function inbase() {
	var base;
	if(inradius(base)) {
		switch(player.state) {
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
	var lat = player.position['lat'];
	var lng = player.position['lng'];

	var objLat = obj.position['lat'];
	var objLng = obj.position['lng'];

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
	for(var i = 0; enemyFlagList.length; ++i) {
		var flag = enemyFlagList[i];
		if(flag.caught && flag.holdingPlayerId === player.playerId) {
			// flag disappears from the other team's side
			//teams[teamId].points += 1;
			player.state = State.NORMAL;
			isWinning(playerTeamId);
			break;
		}
	}
}

function unlockPosition() {
	player.state = State.NORMAL;
	player.caughtPosition = {};
}

// oneself being caught
// function beingReleased() {
// 	if(player.position === player.caughtPosition) {
// 		player.state = State.RELEASED;
// 		alert('go back to your base');
// 	} else {
// 		alert("you need to be at your caught position");
// 	}
// }

// function frozen() {
// 	player.state = State.CAUGHT;
// 	player.caughtPosition = position;
// 	alert('stop moving');
// }