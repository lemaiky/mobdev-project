function grab() {
	if(state === State.CAUGHT) {
		return;
	}

	// check all flags
	var flag;
	if(flag.teamId != teamId && inradius(flag)) {
		flag.caught = true;
		flag.holdingPlayerId = playerId;
		state = State.FLAG;
	}
}

function release() {
	if(state === State.CAUGHT) {
		return;
	}

	var friend;
	// check all friends
	if(friend.state === State.CAUGHT && inradius(friend)) {
		// send message to go back to base
		// friend.beingReleased();
	}
}

function freezeEnemy() {
	var enemy;
	if (enemy.state != State.RELEASED && inradius(enemy)) {
		if(enemy.state === State.FLAG) {
			resetFlag(enemy);
		}
		// send a message to catch the player
		// enemy.frozen();
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
	var objLat = lat + 0.000001;
	var objLng = lng + 0.000001;

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
		/*
		if (Player.teamId != teamId && Player.state != State.RELEASED) {
			if(Player.state === FLAG) {
				resetFlag(Player);
			}
			Player.state = State.CAUGHT;		// send a message to catch the player
		}
		else if (Player.teamId === teamId && Player.teamId.state === State.CAUGHT)
			Player.state = State.RELEASED;
		else if (Flag.teamId != teamId)
			caught = true;
		else if (Base.teamId === teamId && state === State.FLAG) {
			winningFlag();
		} else if (Base.teamId === teamId && state === State.RELEASED) {
			unlockPosition();
		}
		*/

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
	for(var i = 0; Game.teams[teamId].flags.length; ++i) {
		var flag = Game.teams[teamId].flags[i];
		if(flag.caught && flag.holdingPlayerId === enemy.playerId) {
			flag.position = flag.originalPos;
			flag.caught = false;
			break;
		}
	}
}

function winningFlag() {
	var enemyTeamId;
	for(var i = 0; Game.teams[enemyTeamId].flags.length; ++i) {
		var flag = Game.teams[enemyTeamId].flags[i];
		if(flag.caught && flag.holdingPlayerId === playerId) {
			// flag disappears from the other team's side
			Game.teams[teamId].points += 1;
			state = State.NORMAL;
			isWinning(teamId);
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
	} else {
		alert("you need to be at your caught position");
	}
}

function frozen() {
	state = State.CAUGHT;
	caughtPosition = position;
	alert('stop moving');
}