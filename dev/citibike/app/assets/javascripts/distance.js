function getDistance(lat1,lng1,lat2,lng2) {
  var i = lat1 - lat2;
  var j = lng1 - lng2;
    return i*i + j*j;
}

function findNearestStation(lat,lng) {
  var min_distance = 99999;
  var closest_station_id;
  $.each(stations.stationBeanList, function(i, station) {
    var distance = getDistance(lat,lng, station.latitude, station.longitude);

    // set bike count to be greater than 0, should probably set to 1 or 2
    // or have an alert that there is only one bike, and you may want to consider 
    // another station
    if (distance < min_distance && station.availableBikes > 2 && station.statusValue == "In Service") {
      min_distance = distance;
      closest_station_id = i;
    }
  });

  console.log('Closest station idx: ' + closest_station_id);

  return stations.stationBeanList[closest_station_id];
}
