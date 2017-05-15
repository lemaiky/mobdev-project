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
			//pubGrabFlag();
			break;
		}
	}
}

function release() {
	if(player.state === State.CAUGHT) {
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
		if (enemy.state === State.FLAG && inradius(enemy)) {
			resetFlag(enemy);
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

function isWinning() {
	var team, enemyTeam;
	if(player.teamId === 0) {
		team = Game.teams.team0;
		enemyTeam = Game.teams.team1;
	} else {
		team = Game.teams.team1;
		enemyTeam = Game.teams.team0;
	}
	
	// show winning page on team
	// show losing page on enemyTeam
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
			if(team.points === 5)
				isWinning();
			
			break;
		}
	}
}

function unlockPosition() {
	player.state = State.NORMAL;
	player.caughtPosition = {};
}