/*
	var player;
	var playerId;  //Unqiue user id from username
	var playerTeamId; // THIS Client team id
	var playersConnected = new Array(); //List of players connected
	var friendlyFlagList = new Array(); //List of flag objects 
	var enemyFlagList = new Array(); //List of flag objects 
*/

function grab() {
	if(player.state === State.CAUGHT || player.state === State.RELEASED) {
		console.log("can't grab a flag");
		return;
	}

	setTimeout(function() {
		if(freezeEnemy())
		return;

		// check all flags
		for(var i = 0; i < enemyFlagList.length; ++i) {
			var flag = enemyFlagList[i];
			if(inradius(flag, "flag")) {
				flag.caught = true;
				flag.holdingPlayerId = player.playerId;
				player.state = State.FLAG;
				//pubGrabFlag();
				break;
			}
		}
	}, 5000);
}

function release() {
	if(player.state === State.CAUGHT || player.state === State.RELEASED) {
		console.log("can't release a friend");
		return;
	}

	var friend, team;
	if(player.teamId === 0)
		team = Game.teams.team0;
	else
		team = Game.teams.team1;
	
	// check all friends
	for(var i = 0; i < team.players.length; ++i) {
		friend = team.players[i];
		if(friend.position === friend.caughtPosition && friend.state === State.CAUGHT && inradius(friend)) {
			// send message to release friend
			pubReleaseFriend(friend.playerId, State.RELEASED);
			break;
		}
	}
}

function freezeEnemy() {
	var enemy, enemyTeam;
	if(player.teamId === 0)
		enemyTeam = Game.teams.team1;
	else
		enemyTeam = Game.teams.team0;

	// check all enemies
	for(var i = 0; i < enemyTeam.players.length; ++i) {
		enemy = enemyTeam.players[i];
		if (enemy.teamId != player.teamId && enemy.state != State.RELEASED && enemy.state != State.CAUGHT && inradius(enemy)) {
			if(enemy.state === State.FLAG)
				resetFlag(enemy);
			// send a message to freeze the player
			pubFreezeEnemy(enemy.playerId, player.position, State.CAUGHT);
			return true;
		}
	}
	return false;
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
	if(player.teamId === 0) {
		base = Game.teams.team0.base;
	} else {
		base = Game.teams.team0.base;
	}

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

function inradius(obj, type) {
	// own position
	var lat = player.position['lat'];
	var lng = player.position['lng'];
	var LatLng = new google.maps.LatLng(lat, lng);


	var objLat, objLng, LatLngObj;
	if(type && type === "flag") {
		objLat = obj.originalPos['lat'];
		objLng = obj.originalPos['lng'];
	} else {
		objLat = obj.position['lat'];
		objLng = obj.position['lng'];
	}
	LatLngObj = new google.maps.LatLng(objLat, objLng);
	
	var d = google.maps.geometry.spherical.computeDistanceBetween(LatLng, LatLngObj);

	if(d <= 10) {
		console.log("inside radius " + d)
		return true;
	} else {
		console.log("outside radius " + d);
		return false;
	}
}

function resetFlag(enemy) {
	for(var i = 0; friendlyFlagList.length; ++i) {
		var flag = friendlyFlagList[i];
		if(flag.win && flag.win === true)
			continue;
		
		if(flag.caught && flag.holdingPlayerId === enemy.playerId) {
			flag.position = flag.originalPos;
			flag.caught = false;
			flag.holdingPlayerId = 0;
			break;
		}
	}
}

function winningFlag() {
	var team;
	if(player.teamId === 0)
		team = Game.teams.team0;
	else
		team = Game.teams.team1;

	for(var i = 0; enemyFlagList.length; ++i) {
		var flag = enemyFlagList[i];
		if(flag.caught && flag.holdingPlayerId === player.playerId) {
			// flag disappears from the other team's side
			team.points += 1;
			flag.win = true;
			player.state = State.NORMAL;
			pubTeamPoints(player.teamId, team.points);
			if(team.points === 5)
				pubWinningTeam(player.teamId);

			break;
		}
	}
}

function unlockPosition() {
	player.state = State.NORMAL;
	player.caughtPosition = {};
}