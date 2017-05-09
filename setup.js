
var playerId;  //Unqiue user id from username
var pubnub_channel; //Publish channel
var playersConnected;

var pubnub = new PubNub({ //Keys
		publishKey: 'pub-c-55161405-5bed-4bdc-b6fe-fb40a35da458',
		subscribeKey: 'sub-c-7209c0a8-34bc-11e7-81b3-02ee2ddab7fe',
		sss: true
})


//Combine these 2 same thing...
function createGame(gamename, username){ 
	// Create a unique username from inpu
	console.log("trying to create game");
	console.log(gamename);

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
	playerId = username + "-" + Math.random().toString(36).slice(2); // Creates a unique id for each player
	pubnub_channel = "MobileCatchTheFlag";

	pubnub.setUUID(playerId);
	console.log("is now trying to subscribe");
	pubnub.subscribe({
    	channels: [pubnub_channel]
	});
   
	publish("sending connected through pubnub");
	//Tell all other that a new player is connected


	//sendInfo(username); // Tell everyone that a new player is joined and the info of the player

}

function sendInfo(username){
	var msg = new playerJoinedMsg();

	var jsonMsg = JSON.stringify(playerObj);

	publish(jsonMsg);


}

function publish(msg){
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

    message: function(msg) {
        //var msgObj = JSON.parse(message);
        /*
        if(msgObj.msgType == 0){ // player info

        }else if(msgObj.msgType == 1){	//map posiiton

        }else if(msgObj.msgType == 2){	//player joined team

        }else if(msgObj.msgType == 3){	//flag placements

        }else{ 
        }
       *///Defeault msg
        	console.log("msg rec");
        	console.log(msg.message);
    }
})

