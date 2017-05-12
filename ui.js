var map;
var playingArea;
var drawingManager;
var homeBaseListener;


/// INITIALIZATION

// $('#newgame')[0].onClick = createGame($('#gameName')[0].value, $('#nickname')[0].value);
// $('#joingame').onClick = joinGame($('#gameName')[0].value, $('#nickname')[0].value);
$('#newgame').click(function(){
	createGame($('#gameName')[0].value, $('#nickname')[0].value);
});

$('#joingame').click(function(){
	joinGame($('#gameName')[0].value, $('#nickname')[0].value);
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
		oomControl: false,
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
	// gamestartdiv = document.getElementById('gamestart');
	// map.controls[google.maps.ControlPosition.TOP_CENTER].push(gamestartdiv);

}




/*************** START GAME FORM****************/


//jQuery time
var current_fs, next_fs, previous_fs; //fieldsets
var left, opacity, scale; //fieldset properties which we will animate
var animating; //flag to prevent quick multi-click glitches

$(".next").click(function(){
	if(animating) return false;
	animating = true;
	
	current_fs = $(this).parent();
	next_fs = $(this).parent().next();
	
	
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
});

$("#toAreaSelection").click(function(){

	drawingManager = new google.maps.drawing.DrawingManager({
		drawingMode: google.maps.drawing.OverlayType.POLYGON,
		drawingControl: false,
	});
	drawingManager.setMap(map);

	google.maps.event.addListener(drawingManager, 'polygoncomplete', function(polygon){
		drawingManager.setOptions({
			drawingMode: null
		})
		playingArea = polygon;
		var coordinates  = (polygon.getPath().getArray()); // These should be the coords

		console.log("polygon coordinates below ");
		console.log(coordinates);

		// send these polygon coordinates to ziad
		pubMapPosition(coordinates);
	});
});

$("#resetPlayingArea").off()

$("#resetPlayingArea").click(function(){
	playingArea.setMap(null);
	drawingManager.setOptions({
		drawingMode:google.maps.drawing.OverlayType.POLYGON
	})
});



$('#broadcastPlayers').click(function(){
	pubPlayerList();
})

$("#toHomeBasePlacement").click(function(){

	drawingManager.setOptions({
		drawingMode: google.maps.drawing.OverlayType.MARKER,
		drawingControl: false,
	});
	drawingManager.setMap(map);

	homeBaseListener = google.maps.event.addListener(drawingManager, 'markercomplete', function(marker){
		drawingManager.setOptions({
			drawingMode: null
		})
		var coordinates  = marker.getPosition();
		console.log(coordinates);

		// send these home base coordinates to ziad
		pubBasePosition(coordinates); // He wants team id also. How do we get that? 
	});
});

// $("#resetHomeBasePlacement").click(function(){
// 	playingArea.setMap(null);
// 	drawingManager.setOptions({
// 		drawingMode:google.maps.drawing.OverlayType.POLYGON
// 	})
// });

$("#toFlagPlacement").click(function(){
	flagList = [];

		google.maps.event.removeListener(homeBaseListener);

		drawingManager.setOptions({
			drawingMode: google.maps.drawing.OverlayType.MARKER,
			drawingControl: false,
		});
		
		drawingManager.setMap(map);
		
		flagPlacementListener = google.maps.event.addListener(drawingManager, 'markercomplete', function(marker){
			drawingManager.setOptions({
				drawingControl: false,
			});
			console.log("flag positioned ");
			
			flagList.push(marker.getPosition());
			console.log(flagList.length); 

			if (flagList.length == 5) {
				drawingManager.setOptions({
					drawingMode: null,
				});
			}
		});
});

$("#toConfirm").click(function(){
	drawingManager.setOptions({
		drawingMode: null
	});

	console.log(flagList.length);
	// send these home base coordinates to ziad
	pubFlagPosition(flagList); // He wants team id also. How do we get that? 
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

// f

// $('#post4').after('<div id="post5">new post content</div>');

function addPlayertoFreePlayersListUI(playername, playerID){
	var newplayer = document.createElement('li');
	newplayer.setAttribute('data-draggable', 'item');
	newplayer.setAttribute('draggable', true);
	newplayer.innerText = playername;
	newplayer.id = playerID;
	$('#freeplayers').append(newplayer);
}

function updateMapInfoUI(coordinates){
	playingArea = new google.maps.Polygon({
		paths:coordinates
	})
	playingArea.setMap(map);
}








