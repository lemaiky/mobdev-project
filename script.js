
var lat;
var lng;
var map;
var marker;
var markerList = []
var labels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
var labelIndex = 0;


// Pubnub keys to allow us to use their network
var pnChannel = "map-channelOR";
var pubnub = new PubNub({
  publishKey: 'pub-c-609a8ba5-d39c-44f6-9781-e1ac5db06375',
  subscribeKey: 'sub-c-8952104c-2ffa-11e7-bc1c-0619f8945a4f',
  sss: true
});

// When a message is received, call the function "redraw" with the coordinate data in the message
function redraw(payload) {
  markeruuid = payload.message.markeruuid;
  for (var i in markerList) {
    if (markeruuid == markerList[i].uuid) {
      lat = payload.message.markerlat;
      lng = payload.message.markerlng;
      markerList[i].setPosition({lat:lat, lng:lng});
        console.log("updated position of marker " + markerList[i].uuid + "to position lat: " + lat + ", lng: " +lng);
    }
  }
};

// listening to the subscribed channel. calling the function "redraw(message)" when message is received
pubnub.addListener({
    status: function(statusEvent) {
        if (statusEvent.category === "PNConnectedCategory") {
          //console.log(statusEvent.category);
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
      redraw(message);
    }
});

// Subscribing
pubnub.subscribe({channels: [pnChannel]});


// This is called when "Connect" button is pushed
function initialize(markerName) {
    navigator.geolocation.getCurrentPosition(function(position) {
      lat = position.coords.latitude;
      lng = position.coords.longitude;

    });
    // ###############################################
    // ################### OBSERVE ###################
    // ###############################################    
    // Coordinates might be undefined in the beginning
    // If so, the initialization will fail
    // Will have to handle that somehow. Tried while loop with setTimeout, but no success so far
    // For now, wait to push the "Connect"-button before lat and lng are numbers

    map  = new google.maps.Map(document.getElementById('map-canvas'), {center:{lat:lat,lng:lng},zoom:12});
    marker = new google.maps.Marker({position:{lat:lat, lng:lng}, map:map});
    // giving marker a uuid
    marker.uuid = markerName + "-" + Math.random().toString(36).slice(2);
    marker.title   = marker.uuid;

    // Label to know which marker is out and about
    marker.label = labels[labelIndex++ % labels.length];
    markerList.push(marker);
    console.log(markerList[markerList.length-1].label);
    console.log("initial lat: " +lat);
    console.log("initial lng: " +lng);

    trackPosition(markerList[markerList.length-1]);
  	
};

// Track
function trackPosition(marker) {
  setInterval(function() {
    navigator.geolocation.getCurrentPosition(function(position) {
        markerLat = position.coords.latitude+Math.random()*0.01;
        markerLng = position.coords.longitude+Math.random()*0.01;
    });
    publishPosition(marker,markerLat,markerLng);
  }, 4000);

};

// Publish
function publishPosition(marker, markerLat, markerLng) {
  markeruuid = marker.uuid;
  markerlat = markerLat;
  markerlng = markerLng;
  pubnub.publish(
      {
        message: {
          markeruuid,
          markerlat, 
          markerlng
        },
        channel: pnChannel
      },
      function(status, response) {
        if (status.error) {
            //console.log("publishing failed w/ status: ", status);
        } else {
            //console.log("message published w/ server response: ", response);
            //console.log("message published w/ marker uuid: ", marker.uuid);
      }
    }
  );
}