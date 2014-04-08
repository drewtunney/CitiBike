
App.directionsService  = new google.maps.DirectionsService();
App.directionsDisplay1 = new google.maps.DirectionsRenderer({
  preserveViewport: true,
  suppressMarkers : true,
  polylineOptions : {strokeColor:'blue'},
});

App.directionsDisplay2 = new google.maps.DirectionsRenderer({
  preserveViewport: true,
  suppressMarkers : true,
  polylineOptions : {strokeColor:'red'},
});

App.directionsDisplay3 = new google.maps.DirectionsRenderer({
  preserveViewport: true,
  suppressMarkers : true,
  polylineOptions : {strokeColor:'green'},
});


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
  // TODO remove polylines function here? 
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
        $('#directions-info1').text("Walk From " + App.startPoint + " to the CitiBike Station at " + App.startStation.stationName);
        $('#station-status1').text("There are " + App.startStation.availableBikes + " bikes available");
        App.directionsDisplay1.setDirections(result);
      }
    });

    App.directionsService.route(startLeg, function(result, status) {
      if (status == google.maps.DirectionsStatus.OK) {
        $('#directions-info2').text("Bike From the " + App.startStation.stationName + " Station to the " + App.endStation.stationName + " Station");
        // var trip_legs = result.routes[0].overview_path;
        // App.drawPolylines(trip_legs);
        App.directionsDisplay2.setDirections(result);
      }
    });

    App.directionsService.route(endLeg, function(result, status) {
      if (status == google.maps.DirectionsStatus.OK) {
        $('#directions-info3').text("Walk From " + App.endStation.stationName + " Station to " + App.endPoint);
        $('#station-status3').text("There are " + App.endStation.availableDocks + " docks available");
        // var trip_legs = result.routes[0].overview_path;
        // App.drawPolylines(trip_legs);
        App.directionsDisplay3.setDirections(result);
      }
    });
  }
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
    var pos;
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

  map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);
  App.directionsDisplay1.setMap(map);
  App.directionsDisplay2.setMap(map);
  App.directionsDisplay3.setMap(map);
  App.directionsDisplay1.setPanel(document.getElementById("directionsPanel1"));
  App.directionsDisplay2.setPanel(document.getElementById("directionsPanel2"));
  App.directionsDisplay3.setPanel(document.getElementById("directionsPanel3"));
  
  // load Stations
  App.updateStationsInfo();
  window.setInterval(App.updateStationsInfo, 60000);
  // setStationInterval();

  // add event listener to form submission
  $('#get-directions-form').on('submit', function(e){
    $('.adp').remove();
    e.preventDefault();
    App.getDirections();
  });
});
