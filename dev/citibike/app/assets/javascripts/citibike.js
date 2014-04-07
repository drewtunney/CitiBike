App.directionsService = new google.maps.DirectionsService();
App.directionsDisplay = new google.maps.DirectionsRenderer();
App.directionsDisplay1 = new google.maps.DirectionsRenderer();

// load stations object into window
App.updateStationsInfo = function(){
  $.getJSON('/stations', function(data){ 
    App.stations = data; 
    console.log(App.stations);
  });
}


App.getStation = function(address, waypoint) {
  var geocoder = new google.maps.Geocoder();

  geocoder.geocode({
      'address': address
  }, function (results, status) {
      if (status == google.maps.GeocoderStatus.OK) {
        var latitude  = results[0].geometry.location.lat();
        var longitude = results[0].geometry.location.lng();
        
        if (waypoint === "start") {
          var station = findPickUpStation(latitude, longitude);
          App.setStation(station, waypoint);
          console.log("in start")
        }
        else {
          // change this
          var station = findDropOffStation(latitude, longitude);
          App.setStation(station, waypoint);
          console.log("in end")
        }
      } else {
        alert("Geocode was not successful for the following reason: " + status);
      }
  });
}

App.setStation = function(station, waypoint) {
  App[waypoint + "Station"] = station;
  App.buildDirections();
}

App.buildDirections = function(){
  if (App.startStation && App.endStation) {
    console.log("Got stations, ready to build...");

    var startStatLatLng = new google.maps.LatLng(App.startStation.latitude, App.startStation.longitude);
    var endStatLatLng   = new google.maps.LatLng(App.endStation.latitude,   App.endStation.longitude);

    var startLeg = {
      origin: App.startPoint,
      destination: startStatLatLng,
      travelMode: google.maps.TravelMode.WALKING
    };
    var middleLeg = {
      origin: startStatLatLng,
      destination: endStatLatLng,
      travelMode: google.maps.TravelMode.BICYCLING
    };
    var endLeg = {
      origin: endStatLatLng,
      destination: App.endPoint,
      travelMode: google.maps.TravelMode.WALKING
    };
    
    App.directionsService.route(middleLeg, function(result, status) {
      if (status == google.maps.DirectionsStatus.OK) {
        App.directionsDisplay.setDirections(result);
        console.log(result);
      }
    });

    App.directionsService.route(startLeg, function(result, status) {
      if (status == google.maps.DirectionsStatus.OK) {
        App.directionsDisplay1.setDirections(result);
        console.log(result);
      }
    });
    // debugger;
    // App.directionsService.route(endLeg, function(result, status) {
    //   if (status == google.maps.DirectionsStatus.OK) {
    //     App.directionsDisplay.setDirections(result);
    //   }
    // });
  }
  // } else {
  //   console.log("Some stations set, but not all...");
  // }
}

App.getDirections = function(){
  // get start and end                  ... defaults -- should remove after testing!
  App.startPoint = $('#start').val() || "10 E 21st St, New York, NY";
  App.endPoint   = $('#end').val()   || "Central Park W and 79th St, New York, NY";

  // begin the process of choosing a startStation
  App.getStation(App.startPoint, "start");

  // begin the process of choosing an endStation
  App.getStation(App.endPoint, "end");
}

App.getCurrentLocation = function(){
  if(navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      var pos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
      console.log(pos)
    });
  } else {
    handleNoGeolocation(false);
  }
}

$(function(){
  // initialize map
  var new_york = new google.maps.LatLng(40.7284186, -73.98713956);
  var mapOptions = {
    zoom: 12,
    center: new_york
  };

  var map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);
  App.directionsDisplay.setMap(map);
  App.directionsDisplay.setPanel(document.getElementById("directionsPanel"));
  App.directionsDisplay1.setPanel(document.getElementById("directionsPanel2"));
  
  // load Stations
  App.updateStationsInfo();

  // add event listener to form submission
  $('#get-directions-form').on('submit', function(e){
    $('.adp').remove();
    e.preventDefault();
    App.getDirections();
  });
});
