


var playerId;  //Unqiue user id from username
var pubnub_channel; //Publish channel
var playersConnected;

var pubnub;


//Combine these 2 same thing...
function newGame(username, gamename){ 
	// Create a unique username from inpu
	init(username, gamename);

}
function connectToGame(username, gamename){
	init(username, gamename);
}
/*
	Creates a unique user id
	subscribes to a channel
	sends client information to all other clients
*/

function init(username, gameame){
	playerId = username + "-" + Math.random().toString(36).slice(2); // Creates a unique id for each player
	pubnub_channel = "mobileCatchTheFlag/" + gamename; = "mobileCatchTheFlag/" + gamename;

	pubnub = new PubNub({ //Keys
		publishKey: 'pub-c-55161405-5bed-4bdc-b6fe-fb40a35da458',
		subscribeKey: 'sub-c-7209c0a8-34bc-11e7-81b3-02ee2ddab7fe',
		sss: true,
		uuid: playerId
	});
	pubnub.subscribe({channels: [pubnub_channel]});

	//Tell all other that a new player is connected


	sendInfo(username); // Tell everyone that a new player is joined and the info of the player

}

function sendInfo(username){
	var msg = {
		'msg_type': 0,
		'nickname': username,
		'playerId': playerId,
	}
	playerObj.nickname = username;
	playerObj.playerId = playerId;

	var jsonMsg = JSON.stringify(playerObj);

	publish(jsonMsg);


}


function publish(msg){
	var pubConfig = {
		channel: pubnub_channel,
		message: msg
	}
	pubnub.publish(pubConfig, )
}

pubnub.addListener({
    status: function(statusEvent) {
        if (statusEvent.category === "PNConnectedCategory") {
            //Do something if connected
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
    message: function(message) {
        //Handle message
    }
})

