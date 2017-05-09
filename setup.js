


var uusername;  //Unqiue user id from username
var pub_channel; //Publish channel
var sub_channel; // Subscribe channel


var pubnub = new PubNub({ //Keys
  publishKey: 'pub-c-55161405-5bed-4bdc-b6fe-fb40a35da458',
  subscribeKey: 'sub-c-7209c0a8-34bc-11e7-81b3-02ee2ddab7fe',
  sss: true
});


function init(username, gameame){
	uusername = username + "-" + Math.random().toString(36).slice(2); // Creates a unique id for each player
	pub_channel = "mobileCatchTheFlag/" + gamename;
	sub_channel = "mobileCatchTheFlag/" + gamename;

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
/*
	Input: Username & Game name 
	Creats a new game by creating
	a pubnub channel and subscribing to it
*/
function newGame(username, gamename){
	// Create a unique username from input
	// Create a new channel and subscribe to it

	init(username, gamename);




}

function connectToGame(username, gamename){

}


