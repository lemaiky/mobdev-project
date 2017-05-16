var map;
var playingArea;
var drawingManager;
var homeBaseListener;
var ownFlagListUI = [];
var enemyFlagListUI = [];
var homeBase; 
var enemyBase;
var players ={};
var ownMarker; 
var ownRadius;
var isWaiting=false;
var isHomebaseSet = false;



/// INITIALIZATION

// $('#newgame')[0].onClick = createGame($('#gameName')[0].value, $('#nickname')[0].value);
// $('#joingame').onClick = joinGame($('#gameName')[0].value, $('#nickname')[0].value);
$('#newgame').click(function(){
	createGame($('#gameName')[0].value, $('#nickname')[0].value);
	$("#toAreaSelection").hide();
	continueForm(this, true);
});


$('#joingame').click(function(){
	isWaiting=true;
	joinGame($('#gameName')[0].value, $('#nickname')[0].value);
	continueForm(this);
});




// Callback function for current location search
function centerOnPos(position) {	// NOT BEING USED
	map.setCenter({lat:position.coords.latitude , lng:position.coords.longitude });
}


function initMap() {  
	var styledMapType = new google.maps.StyledMapType(
		[
	{
		"elementType": "geometry",
		"stylers": [
			{
				"color": "#ebe3cd"
			}
		]
	},
	{
		"elementType": "labels.text.fill",
		"stylers": [
			{
				"color": "#523735"
			}
		]
	},
	{
		"elementType": "labels.text.stroke",
		"stylers": [
			{
				"color": "#f5f1e6"
			}
		]
	},
	{
		"featureType": "administrative",
		"elementType": "geometry.stroke",
		"stylers": [
			{
				"color": "#c9b2a6"
			}
		]
	},
	{
		"featureType": "administrative.land_parcel",
		"stylers": [
			{
				"visibility": "off"
			}
		]
	},
	{
		"featureType": "administrative.land_parcel",
		"elementType": "geometry.stroke",
		"stylers": [
			{
				"color": "#dcd2be"
			}
		]
	},
	{
		"featureType": "administrative.land_parcel",
		"elementType": "labels.text.fill",
		"stylers": [
			{
				"color": "#ae9e90"
			}
		]
	},
	{
		"featureType": "administrative.neighborhood",
		"stylers": [
			{
				"visibility": "off"
			}
		]
	},
	{
		"featureType": "landscape.natural",
		"elementType": "geometry",
		"stylers": [
			{
				"color": "#dfd2ae"
			}
		]
	},
	{
		"featureType": "poi",
		"elementType": "geometry",
		"stylers": [
			{
				"color": "#dfd2ae"
			}
		]
	},
	{
		"featureType": "poi",
		"elementType": "labels.text",
		"stylers": [
			{
				"visibility": "off"
			}
		]
	},
	{
		"featureType": "poi",
		"elementType": "labels.text.fill",
		"stylers": [
			{
				"color": "#93817c"
			}
		]
	},
	{
		"featureType": "poi.park",
		"elementType": "geometry.fill",
		"stylers": [
			{
				"color": "#a5b076"
			}
		]
	},
	{
		"featureType": "poi.park",
		"elementType": "labels.text.fill",
		"stylers": [
			{
				"color": "#447530"
			}
		]
	},
	{
		"featureType": "road",
		"elementType": "geometry",
		"stylers": [
			{
				"color": "#f5f1e6"
			}
		]
	},
	{
		"featureType": "road",
		"elementType": "labels",
		"stylers": [
			{
				"visibility": "off"
			}
		]
	},
	{
		"featureType": "road.arterial",
		"elementType": "geometry",
		"stylers": [
			{
				"color": "#fdfcf8"
			}
		]
	},
	{
		"featureType": "road.highway",
		"elementType": "geometry",
		"stylers": [
			{
				"color": "#f8c967"
			}
		]
	},
	{
		"featureType": "road.highway",
		"elementType": "geometry.stroke",
		"stylers": [
			{
				"color": "#e9bc62"
			}
		]
	},
	{
		"featureType": "road.highway.controlled_access",
		"elementType": "geometry",
		"stylers": [
			{
				"color": "#e98d58"
			}
		]
	},
	{
		"featureType": "road.highway.controlled_access",
		"elementType": "geometry.stroke",
		"stylers": [
			{
				"color": "#db8555"
			}
		]
	},
	{
		"featureType": "road.local",
		"elementType": "labels.text.fill",
		"stylers": [
			{
				"color": "#806b63"
			}
		]
	},
	{
		"featureType": "transit.line",
		"elementType": "geometry",
		"stylers": [
			{
				"color": "#dfd2ae"
			}
		]
	},
	{
		"featureType": "transit.line",
		"elementType": "labels.text.fill",
		"stylers": [
			{
				"color": "#8f7d77"
			}
		]
	},
	{
		"featureType": "transit.line",
		"elementType": "labels.text.stroke",
		"stylers": [
			{
				"color": "#ebe3cd"
			}
		]
	},
	{
		"featureType": "transit.station",
		"elementType": "geometry",
		"stylers": [
			{
				"color": "#dfd2ae"
			}
		]
	},
	{
		"featureType": "water",
		"elementType": "geometry.fill",
		"stylers": [
			{
				"color": "#b9d3c2"
			}
		]
	},
	{
		"featureType": "water",
		"elementType": "labels.text",
		"stylers": [
			{
				"visibility": "off"
			}
		]
	},
	{
		"featureType": "water",
		"elementType": "labels.text.fill",
		"stylers": [
			{
				"color": "#92998d"
			}
		]
	}
]
	)       
	map = new google.maps.Map(document.getElementById('map'), { 
		center: {lat: 59.349405116200636, lng: 18.072359561920166},
		zoom: 17,
		mapTypeId: 'roadmap',
		disableDefaultUI: true, 
		zoomControl: false,
		zoomControlOptions: {   position: google.maps.ControlPosition.LEFT_CENTER        
		},          
		scaleControl: false,
		streetViewControl: false,
		rotateControl: false,
		fullscreenControl: false,
		mapTypeControl: true,
	});

	map.mapTypes.set('styled_map', styledMapType);
	map.setMapTypeId('styled_map');

	navigator.geolocation.getCurrentPosition(function(position){
		mapInitPos = {
			lat: position.coords.latitude,
			lng: position.coords.longitude
		}
		map.setCenter(mapInitPos);
	});

	// gamestartdiv = document.getElementById('gamestart');
	// map.controls[google.maps.ControlPosition.TOP_CENTER].push(gamestartdiv);

}




// if (!isHomebaseSet){
// 		// nothing happens
// 		alert("Please set homebase!");

/*************** START GAME FORM****************/


//jQuery time
var current_fs, next_fs, previous_fs; //fieldsets
var left, opacity, scale; //fieldset properties which we will animate
var animating; //flag to prevent quick multi-click glitches

$(".next").click(function(){
	console.log(this.id);
	if (this.id == "toFlagPlacement"){
		if (homeBase != null){
			// proceed
			continueForm(this);
		} else {
			alert("No homebase is set!");
		}
	} else if (this.id == "toAreaSelection"){
		continueForm(this);
	} else if (this.id == "toHomeBasePlacement"){
		if (playingArea != null){
			continueForm(this);
		} else {
			alert("Set playing area!");
		}
	} else if (this.id == "toConfirm"){
		if (ownFlagListUI.length < 5){
			alert("Set more flags!");
		} else if (ownFlagListUI.length == 5){
			continueForm(this);
		} 
	} else if (this.id == "startgame"){
		continueForm(this);
	}

});

function continueForm(el, skip){
	if(animating) return false;
	animating = true;

	current_fs = $(el).parent();
	next_fs = $(el).parent().next();

	if (skip){
		next_fs = $(el).parent().next().next();
	}

	
	
	//show the next fieldset
	next_fs.show(); 
	//hide the current fieldset with style
	current_fs.animate({opacity: 0}, {
		step: function(now, mx) {
			//as the opacity of current_fs reduces to 0 - stored in "now"
			//1. scale current_fs down to 80%
			scale = 1 - (1 - now) * 0.2;
			//2. bring next_fs from the right(50%)
			left = (now * 50)+"%";
			//3. increase opacity of next_fs to 1 as it moves in
			opacity = 1 - now;
			current_fs.css({'transform': 'scale('+scale+')'});
			next_fs.css({'left': left, 'opacity': opacity});
		}, 
		duration: 800, 
		complete: function(){
			current_fs.hide();
			animating = false;
		}, 
		//this comes from the custom easing plugin
		easing: 'easeInOutBack'
	});
}

function continueTo(el, nxt){
	if(animating) return false;
	animating = true;

	current_fs = $(el).parent();
	next_fs = $(el).parent().next(nxt);


	
	
	//show the next fieldset
	next_fs.show(); 
	//hide the current fieldset with style
	current_fs.animate({opacity: 0}, {
		step: function(now, mx) {
			//as the opacity of current_fs reduces to 0 - stored in "now"
			//1. scale current_fs down to 80%
			scale = 1 - (1 - now) * 0.2;
			//2. bring next_fs from the right(50%)
			left = (now * 50)+"%";
			//3. increase opacity of next_fs to 1 as it moves in
			opacity = 1 - now;
			current_fs.css({'transform': 'scale('+scale+')'});
			next_fs.css({'left': left, 'opacity': opacity});
		}, 
		duration: 800, 
		complete: function(){
			current_fs.hide();
			animating = false;
		}, 
		//this comes from the custom easing plugin
		easing: 'easeInOutBack'
	});
}

$('#broadcastPlayers').click(function(){
	$("#toAreaSelection").show();
	$('#broadcastPlayers').hide("fast");
	pubPlayerList();
})


$("#toAreaSelection").off();

$("#toAreaSelection").click(function(){

	if (isAdmin())
	{
		continueTo(this, '#playingarea');
		drawingManager = new google.maps.drawing.DrawingManager({
			drawingMode: google.maps.drawing.OverlayType.POLYGON,
			drawingControl: false,
		});
		drawingManager.setMap(map);

		google.maps.event.addListener(drawingManager, 'polygoncomplete', function(polygon){
			console.log('done drawing');
			console.log('animating?');
			if(animating)
				animating = false;
			drawingManager.setOptions({
				drawingMode: null
			})
			playingArea = polygon;
			var coordinates  = (polygon.getPath().getArray()); // These should be the coords
			

			// send these polygon coordinates to ziad
			pubMapPosition(coordinates);
		});

	}
	else{
		console.log('here we should be');
		continueForm(this, true);
		drawingManager = new google.maps.drawing.DrawingManager({
			drawingMode: google.maps.drawing.OverlayType.MARKER,
			drawingControl: false,
		});
		drawingManager.setMap(map);

		homeBaseListener = google.maps.event.addListener(drawingManager, 'markercomplete', function(marker){
			marker.setIcon('resources/icons/baseflag_small_green.png');
			drawingManager.setOptions({
				drawingMode: null
			})
			homeBase = marker;
			var coordinates  = marker.getPosition();
			//console.log(coordinates);

			// send these home base coordinates to ziad
			pubBasePosition(coordinates); 
		});
	}
});

$("#resetPlayingArea").off()

$("#resetPlayingArea").click(function(){
	playingArea.setMap(null);
	drawingManager.setOptions({
		drawingMode:google.maps.drawing.OverlayType.POLYGON
	})
});





$('#toHomeBasePlacement').off()

$("#toHomeBasePlacement").click(function(){
	animating = false;
	createTeams();
	if(true){
		console.log("weroiajeadjfoqijerwoifdjalkfdjowerijrafd");
		// continueTo(this, $('#homebase'));
		// continueTo(this, '#homebase');
		continueForm(this, true);

		drawingManager.setOptions({
			drawingMode: google.maps.drawing.OverlayType.MARKER,
			drawingControl: false,
		});
		drawingManager.setMap(map);

		homeBaseListener = google.maps.event.addListener(drawingManager, 'markercomplete', function(marker){
			var coordinates  = marker.getPosition();
			//console.log(coordinates);
			var insideArea = google.maps.geometry.poly.containsLocation(coordinates, playingArea);
			if(insideArea) {
				marker.setIcon('resources/icons/baseflag_small_green.png');
				drawingManager.setOptions({
					drawingMode: null
				})
				homeBase = marker;
				// send these home base coordinates to ziad
				pubBasePosition(coordinates); // He wants team id also. How do we get that? 	
			} else {
				marker.setMap(null);
			}
		});
		console.log('trynna get to homebase')
	}

});

// $("#resetHomeBasePlacement").click(function(){
// 	playingArea.setMap(null);
// 	drawingManager.setOptions({
// 		drawingMode:google.maps.drawing.OverlayType.POLYGON
// 	})
// });

$("#toFlagPlacement").click(function(){
	if (homeBase != null){
		console.log("homebase is set. Now, place flags");
		console.log(homeBase);
		console.log("##### homeBase variable above");
		ownFlagListUI = [];

		google.maps.event.removeListener(homeBaseListener);

		drawingManager.setOptions({
			drawingMode: google.maps.drawing.OverlayType.MARKER,
			drawingControl: false,
		});
		
		drawingManager.setMap(map);
			
		flagPlacementListener = google.maps.event.addListener(drawingManager, 'markercomplete', function(marker){
			var coordinates = marker.getPosition();
			var insideArea = google.maps.geometry.poly.containsLocation(coordinates, playingArea);

			if(insideArea) {
				marker.setIcon("resources/icons/flag_green.png");
				drawingManager.setOptions({
					drawingControl: false,
				});


				//console.log("flag positioned ");

				// var flag = Object.create(Flag);
				// flag.marker = marker;
				// flag.flagId = ownFlagListUI.length;
				// flag.position = marker.getPosition();
				// flag.teamId = player.teamId;
				// flag.originalPos = marker.getPosition();

				
				ownFlagListUI.push(marker);
				//console.log(flagList.length); 

				if (ownFlagListUI.length == 5) {
					drawingManager.setOptions({
						drawingMode: null,
					});
				}	
			} else {
				marker.setMap(null);
			}
			
		});	
	} else {
		console.log("homebase is not set");
	}	
});

$("#toConfirm").click(function(){
	if (ownFlagListUI.length == 5){

		drawingManager.setOptions({
			drawingMode: null
		});

		posns = [];
		for (var i = 0; i < ownFlagListUI.length; i++){
			posns.push(ownFlagListUI[i].getPosition());
		}
		// send these home base coordinates to ziad
		pubFlagPosition(posns); // He wants team id also. How do we get that? 
	}
});


$("#startgame").click(function(){
	// iterate over players, setting marker

	navigator.geolocation.getCurrentPosition(function(position){
		var pos = {
			lat: position.coords.latitude,
			lng: position.coords.longitude
		};

		ownMarker = new google.maps.Marker({
			position:pos,
			map:map,
			draggable:true,
		});
		ownMarker.setDraggable(true);
		ownMarker.setZIndex(1000000);

		ownRadius = new google.maps.Circle({
			strokeColor: '#FF0000',
			strokeOpacity: 0.8,
			strokeWeight: 2,
			fillColor: '#FF0000',
			fillOpacity: 0.35,
			map: map,
			center: ownMarker.getPosition(),
			radius: 10
		});

		ownRadius.bindTo('center', ownMarker, 'position');
		
	})


	 posnLoop();


	//own team
	for (var i= 0; i < Game.teams.team0.players.length; i++){
		players[Game.teams.team0.players[i].playerId] = new google.maps.Marker({
			map:map, 
			center: ownMarker,
			draggable:true
		});
 	}

 	//otherteam
	for (var i= 0; i < Game.teams.team1.players.length; i++){
		players[Game.teams.team1.players[i].playerId] = new google.maps.Marker({
			map:map, 
			center: ownMarker,
			draggable:true
		});
 	}

	publishGameInfo();
	// buttons
	document.getElementById("gameplayCatchDiv").style.display = "inline-block"; 
	document.getElementById("gameplayReleaseDiv").style.display = "inline-block";

	// header
	document.getElementById("gameplayHeader").style.display = "inline-block";
	document.getElementById("scoreTeam1").innerText = 0;
	document.getElementById("scoreTeam2").innerText = 0;

	// footer
	// document.getElementById("gameplayFooter").style.display = "inline-block";
	// document.getElementById("gameplayTimer").innerText = 0;

});


$( "#team1" ).droppable({
	accept: ".draggable",
	drop: function(event, ui) {
		$(ui.draggable).appendTo('#team1');
		pubTeamChoice(ui.draggable[0].id, 0);
	}
});
$( "#team2" ).droppable({
	accept: ".draggable",
	drop: function(event, ui) {
		$(ui.draggable).appendTo('#team2');
		pubTeamChoice(ui.draggable[0].id, 1);
	}
});

function reloadGameplayUI(){
		// buttons
	document.getElementById("gameplayCatchDiv").style.display = "inline-block"; 
	document.getElementById("gameplayReleaseDiv").style.display = "inline-block";

	// header
	document.getElementById("gameplayHeader").style.display = "inline-block";
}

function enemySuccessfullyGrabbed(){
	console.log("You froze an enemy!")	
	navigator.vibrate(50);
}

function youAreFrozenUI(){
	document.getElementById("youAreFrozen").style.display = "inline-block";
	navigator.vibrate(50);
}

function youAreNotFrozenUI(){
	document.getElementById("youAreFrozen").style.display = "none";
	navigator.vibrate(50);
}

function youHaveTheFlagUI(){
	document.getElementById("youHaveTheFlag").style.display = "inline-block";
	navigator.vibrate(50);
}

function youDontHaveTheFlagUI(){
	document.getElementById("youHaveTheFlag").style.display = "none";
	navigator.vibrate(50);
}

function youLostUI(){
	document.getElementById("gameplayCatchDiv").style.display = "none"; 
	document.getElementById("gameplayReleaseDiv").style.display = "none";
	document.getElementById("gameplayHeader").style.display = "none";
	document.getElementById("gameplayFooter").style.display = "none";

	document.getElementById("youLost").innerText = "You lost! grrr!";
	document.getElementById("youLost").style.display = "inline-block";
	navigator.vibrate(500);
}

function youWonUI(){
	document.getElementById("gameplayCatchDiv").style.display = "none"; 
	document.getElementById("gameplayReleaseDiv").style.display = "none";
	document.getElementById("gameplayHeader").style.display = "none";
	document.getElementById("gameplayFooter").style.display = "none";

	document.getElementById("youWon").innerText = "You won! Well played!";
	document.getElementById("youWon").style.display = "inline-block";
	navigator.vibrate(500);
}

function updateTeamScoreUI(teamid, points){
	if (teamid == 0){
		document.getElementById("scoreTeam1").innerText = points;
	} else if (teamid == 1){
		document.getElementById("scoreTeam2").innerText = points;
	}
}

// function activateGameplayTimer(){
// 	var timer = 0;
// 	console.log("inside activateGameplayTimer");
// 	setInterval(function(){
// 		timer = timer + 1;
// 		document.getElementById("gameplayTimer").innerText = timer;
// 	},1000);
// }

$("#catchButton").click(function(){
	console.log("CATCH");
	grab();
});

$("#releaseButton").click(function(){
	console.log("RELEASE");
	release();
});

$(".previous").click(function(){
	if(animating) return false;
	animating = true;
	
	current_fs = $(this).parent();
	previous_fs = $(this).parent().prev();
	
	
	//show the previous fieldset
	previous_fs.show(); 
	//hide the current fieldset with style
	current_fs.animate({opacity: 0}, {
		step: function(now, mx) {
			//as the opacity of current_fs reduces to 0 - stored in "now"
			//1. scale previous_fs from 80% to 100%
			scale = 0.8 + (1 - now) * 0.2;
			//2. take current_fs to the right(50%) - from 0%
			left = ((1-now) * 50)+"%";
			//3. increase opacity of previous_fs to 1 as it moves in
			opacity = 1 - now;
			current_fs.css({'left': left});
			previous_fs.css({'transform': 'scale('+scale+')', 'opacity': opacity});
		}, 
		duration: 800, 
		complete: function(){
			current_fs.hide();
			animating = false;
		}, 
		//this comes from the custom easing plugin
		easing: 'easeInOutBack'
	});
});

// $(".submit").click(function(){
//  return false;
// })



(function()
{

	//exclude older browsers by the features we need them to support
	//and legacy opera explicitly so we don't waste time on a dead browser
	if
	(
		!document.querySelectorAll 
		|| 
		!('draggable' in document.createElement('span')) 
		|| 
		window.opera
	) 
	{ return; }
	
	//get the collection of draggable items and add their draggable attribute
	for(var 
		items = document.querySelectorAll('[data-draggable="item"]'), 
		len = items.length, 
		i = 0; i < len; i ++)
	{
		items[i].setAttribute('draggable', 'true');
		//items[i].draggable();
	}

	//variable for storing the dragging item reference 
	//this will avoid the need to define any transfer data 
	//which means that the elements don't need to have IDs 
	var item = null;

	//dragstart event to initiate mouse dragging
	document.addEventListener('dragstart', function(e)
	{
		//set the item reference to this element
		item = e.target;
		
		//we don't need the transfer data, but we have to define something
		//otherwise the drop action won't work at all in firefox
		//most browsers support the proper mime-type syntax, eg. "text/plain"
		//but we have to use this incorrect syntax for the benefit of IE10+
		e.dataTransfer.setData('text', '');
	
	}, false);

	//dragover event to allow the drag by preventing its default
	//ie. the default action of an element is not to allow dragging 
	document.addEventListener('dragover', function(e)
	{
		if(item)
		{
			e.preventDefault();
		}
	
	}, false);  

	//drop event to allow the element to be dropped into valid targets
	document.addEventListener('drop', function(e)
	{
		//if this element is a drop target, move the item here 
		//then prevent default to allow the action (same as dragover)
		if(e.target.getAttribute('data-draggable') == 'target')
		{
			e.target.appendChild(item);
			
			e.preventDefault();
		}
	
	}, false);
	
	//dragend event to clean-up after drop or abort
	//which fires whether or not the drop target was valid
	document.addEventListener('dragend', function(e)
	{
		item = null;
	
	}, false);

})();    


function addPlayertoFreePlayersListUI(playername, playerID){
	var newplayer = document.createElement('li');
	newplayer.setAttribute('data-draggable', 'item');
	newplayer.setAttribute('draggable', true);
	newplayer.className = "ui-widget-content ui-draggable draggable";
	newplayer.innerText = playername;
	newplayer.id = playerID;
	newplayer.addEventListener('dragend', function(e){
		var parent = newplayer.parentElement;
		if (parent.id === "team1"){
			pubTeamChoice(newplayer.id, 0);
		}
		else if (parent.id === "team2"){
			pubTeamChoice(newplayer.id, 1);
		}
	})
    
	$('#freeplayers').append(newplayer);
	$( "#" + playerID ).draggable({
		containment: "html",
		helper: "clone",
		revert: "invalid"
	});
}

function updateMapInfoUI(coordinates){
	//console.log("object length");
	//console.log(Object.keys(coordinates).length);
	//objectLength = Object.keys(coordinates).length;
	if (playingArea){
		playingArea.setMap(null);
	}
	playingArea = new google.maps.Polygon({
		paths:coordinates
	})
	playingArea.setMap(map);
	if(!isAdmin())
		{
			console.log('lets try');
			animating = false;
			if ($('#teamselection').is(':visible')){
				continueForm($('#toAreaSelection'), true);
				animating = false;
			}
			console.log('lets see');
			continueForm($("#waitforarea"));
			console.log('should be further now');
		}
}


function updateTeamUI(playerid, teamId){
	var playerlisted = 	$('#'+playerid);
	var currentTeamSelection = playerlisted.parent().attr('id');
	if ((teamId =="0" && currentTeamSelection==="team1") ||
		(teamId =="1" && currentTeamSelection==="team2")){
		return;
	}
	else if (currentTeamSelection == "freeplayers"){
		var destination = '';
		if (teamId == "0"){
			destination = '#team1';
		}
		else{
			destination = '#team2';
		}
		playerlisted.remove().appendTo(destination)
	}
	else if (teamId == "0" && currentTeamSelection == 'team2'){
		playerlisted.remove().appendTo('#team1');
	} 
	else if (teamId == "1" && currentTeamSelection == 'team1'){
		playerlisted.remove().appendTo('#team2');
	}
}

function updateBaseInfoUI(teamId, position){
	received_posn = JSON.parse(position);
	if (teamId == player.teamId){
		if (!homeBase){
			homeBase = new google.maps.Marker({
				position:position,
				map: map
			})
			isHomebaseSet = true;
		}
		homeBase.setPosition(received_posn);
		homeBase.setIcon("resources/icons/baseflag_small_green.png");
	}
	else{
		enemyBase = new google.maps.Marker({
			position:received_posn,
			map:map,
			title: 'ENEMY BASE',
			icon: 'resources/icons/baseflag_small_red.png',
		});
		// enemyBase.setPosition(position);
		enemyBase.setIcon("resources/icons/baseflag_small_red.png");
	}
}



function addFlagUI(teamId, flaglist){
	flagcoords = flaglist;
	if (teamId == player.teamId){
		if (ownFlagListUI.length==0){
			for (var i = 0 ; i < flagcoords.length; i++){
				var marker = new google.maps.Marker({
					position:flagcoords[i],
					map: map,
					icon: "resources/icons/flag_green.png"			//ownFlagListUI[i].setIcon("./resources/icons/flag_green.png");

				});

				ownFlagListUI.push(marker);
				ownFlagListUI[i].setIcon("resources/icons/flag_green.png");
				marker.setMap(map);
			}
		}
	}
	else{
		if (enemyFlagListUI.length==0){
			for (var i = 0; i < flagcoords.length; i++){
				console.log("marking the marker");
				var marker = new google.maps.Marker({
					position:flagcoords[i],
					map: map,
					icon:"resources/icons/flag_red.png"
				});
				marker.setIcon("resources/icons/flag_red.png");
				enemyFlagListUI.push(marker);
				marker.setMap(map);
			}
		}
	}
}

function updatePlayerPosition(playerId, position){
	if (players[playerId])
		players[playerId].setPosition(position);	
}

function updateFlagPosition(teamId, flagId, position){
	console.log("######## ownFlagListUI[flagId] below");
	console.log(flagId);
	if (teamId==player.teamId){
		ownFlagListUI[flagId].setPosition(position);
	}
	else{
		enemyFlagListUI[flagId].setPosition(position);
	}
}

function setPlayersFlagId(flagId){
	player.currentFlag = flagId;
	console.log("####### BELOW player current flag id");
	console.log(player.currentFlag);
}

function updateOwnPosition(){
	navigator.geolocation.getCurrentPosition(function(position){
		posn = {
			lat:position.coords.latitude,
			lng: position.coords.longitude
		};
		if (ownMarker){
			ownMarker.setPosition(posn);
			ownRadius.setCenter(posn);
			pubRegularUpdate(player.playerId, ownMarker.getPosition(), null);
		}

		if (player.state === State.FLAG){
			// console.log("####### BELOW player current flag id");
			// // player.currentFlag = 
			//console.log(player.currentFlag);
			var enemyTeadId;
			if (player.teamId == 0){
				enemyTeamId = 1;
			} else {
				enemyTeamId = 0;
			}
			pubFlagUpdate(enemyTeamId, player.currentFlag, ownMarker.getPosition());
		}
	})
}

function posnLoop(){
	updateOwnPosition();
	setTimeout(posnLoop, 500);
}

function removeFlag(teamId,flagId){
	if (player.teamId != teamId){
		ownFlagListUI[flagId].setMap(null);
	} else {
		enemyFlagListUI[flagId].setMap(null);
	}
}
