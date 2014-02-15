
/* Created by : Dinesh Haribabu

Emp ID: 668332 */

var init=0;
var place=new google.maps.LatLng(20.593684,78.96288);
var geocoder=new google.maps.Geocoder();
var infowindow=new google.maps.InfoWindow();
var query=localStorage.length;
var mapOptions,map,marker,request;
var addrObj,ltlg;
$(document).ready( function () {
	google.maps.visualRefresh = true;
	mapOptions = {
		mapTypeId: google.maps.MapTypeId.ROADMAP,
	};
	map = new google.maps.Map(document.getElementById('map'),mapOptions); //loads map in container id 'map'
	marker = new google.maps.Marker({
		map: map,
	});
	map.setCenter(place);
	map.setZoom(4);
	showQuery();
	$('#current').click(function () {
	infowindow.close();
	//checks whether browser supports geolocation
	if(navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(function (position) {
			ltlg= new google.maps.LatLng(position.coords.latitude,position.coords.longitude);
			request = {
				'latLng':ltlg
			};
			loadMap(); //function to display map with assigned location
		}, function () { //if that geolocation failed for some reason map wll show a place and that is my residence
			ltlg=new google.maps.LatLng(12.952294,80.23515);
			request = {
				'latLng':ltlg
			};
			loadMap();
			});
		}
	else
		alert('Gelolocation not supported'); //shows when geolocation not supported
	});
	$("#mapIt").click(function () {
		$(this).addClass('clicked');
		infowindow.close();
		place = $('#search').val();
		request = {
			'address':place
		};
		loadMap();	
	});
	$('#search').click(function () {
		infowindow.close();
	});
	$('#clear').click(function () {
		localStorage.clear();
		$('#searchList').empty();
		query=0;
	});
	google.maps.event.addDomListener(marker, 'click', function () {
		infowindow.setContent(addrObj.formatted_address);
		infowindow.open(map,marker);
	});
});
//loadMap uses Geocode and localStorage
function loadMap() {
	geocoder.geocode(request,function(results, status) {
		if (status == google.maps.GeocoderStatus.OK) {
			addrObj=results[0];
			map.setCenter(addrObj.geometry.location);
			marker.setPosition(addrObj.geometry.location);
			map.setZoom(15);
			if($('#mapIt').hasClass('clicked')){
				localStorage.setItem(query,addrObj.formatted_address);
				showQuery();
				query++;
			}
			$('#mapIt').removeClass('clicked');
		}
		else
			alert('Geocode was not successful for the following reason: ' + status);
	});
}
//function to display previously stored queries
function showQuery() {
	if(!init) {
		for(i=localStorage.length; i>0; i--) {
			var temp=localStorage.getItem(localStorage.key(i-1));
			$('#searchList').append('<li>' + temp + '</li>');
		}
		init++;
	}
	else {
		var temp=localStorage.getItem(query);
		$('#searchList').prepend('<li>' + temp + '</li>');
	}
	$('#searchList li').click(function () {
		place=$(this).text();
		request = {
			'address':place
		};
		loadMap();
	});
}