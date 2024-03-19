import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, Switch, TouchableOpacity  } from 'react-native';
import * as Location from 'expo-location';
import { AntDesign } from '@expo/vector-icons';
import axios from 'axios';

const Speedometer = () => {
  const [speedKmh, setSpeedKmh] = useState(0);
  // const [speedMph, setSpeedMph] = useState(0);
  const [useMph, setUseMph] = useState(true);
  const [speedLimit, setSpeedLimit] = useState(0);
  const [errorMsg, setErrorMsg] = useState(null);
  const lastLocationRef = useRef(null);
  const lastCallTimeRef = useRef(0);
  const callInterval = 6000; // Minimum interval between API calls (6 seconds)

  const API_KEY = 'c63IvblzdGjwYAe8HLcEbunVMGIi5LGr';

  const projectPoint = (latitude, longitude, distance, heading) => {
    const degreesToRadians = Math.PI / 180;
    const radiansToDegrees = 180 / Math.PI;
    const earthRadiusInMeters = 6378137;
    const distRatio = distance / earthRadiusInMeters;
    const bearing = heading * degreesToRadians; // Convert heading to radians

    const latRad = latitude * degreesToRadians;
    const lonRad = longitude * degreesToRadians;

    const newLatRad = Math.asin(Math.sin(latRad) * Math.cos(distRatio) + Math.cos(latRad) * Math.sin(distRatio) * Math.cos(bearing));
    const newLonRad = lonRad + Math.atan2(Math.sin(bearing) * Math.sin(distRatio) * Math.cos(latRad), Math.cos(distRatio) - Math.sin(latRad) * Math.sin(newLatRad));

    return {
        latitude: newLatRad * radiansToDegrees,
        longitude: newLonRad * radiansToDegrees
    };
  };

  const getDistance = (coords1, coords2) => {
    const degreesToRadians = Math.PI / 180;
    const earthRadiusKm = 6371; // Radius of the Earth in kilometers

    const dLat = (coords2.latitude - coords1.latitude) * degreesToRadians;
    const dLon = (coords2.longitude - coords1.longitude) * degreesToRadians;

    const lat1 = coords1.latitude * degreesToRadians;
    const lat2 = coords2.latitude * degreesToRadians;

    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2); 
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    const distanceKm = earthRadiusKm * c;

    return distanceKm * 1000; // Convert distance to meters and return
  };

  const setMostFrequentSpeedLimit = (route) => {
    const speedLimitCounts = route.reduce((acc, item) => {
      const speedValue = item.properties.speedRestrictions.maximumSpeed.value;
      if (acc[speedValue]) {
        acc[speedValue] += 1;
      } else {
        acc[speedValue] = 1;
      }
      return acc;
    }, {});

    const mostFrequentSpeedLimit = Object.keys(speedLimitCounts).reduce(
      (a, b) => (speedLimitCounts[a] > speedLimitCounts[b] ? a : b)
    );
    console.log("mostFrequentSpeedLimit ", mostFrequentSpeedLimit);
    setSpeedLimit(parseInt(mostFrequentSpeedLimit, 10));
  };

  const getSpeedLimit = async (coords, heading) => {
    const now = Date.now();
    const checkInterval = now - lastCallTimeRef.current < callInterval;
    const checkDistance = (lastLocationRef.current && getDistance(coords, lastLocationRef.current) < 100);
    if (heading === -1 || checkInterval) {
      // Skip the API call if heading is -1, not enough time has passed, or the user hasn't moved significantly
      return;
    }
    console.log("in get speed");

    try {
      const projectedCoords = projectPoint(coords.latitude, coords.longitude, 500, heading); // 500 meters ahead based on current heading
      const coordinatesParameter = `${coords.longitude},${coords.latitude};${projectedCoords.longitude},${projectedCoords.latitude}`;
      const headingsParameter = `${heading};${heading}`
      console.log("coordinatesParameter", coordinatesParameter);

      const apiUrl = `https://api.tomtom.com/snap-to-roads/1/snap-to-roads?points=${coordinatesParameter}&headings=${headingsParameter}&fields={route{type,geometry{type,coordinates},properties{id,speedRestrictions{maximumSpeed{value,unit}}}}}&key=${API_KEY}`;
      const response = await axios.get(apiUrl);
      console.log("response.data.route", response.data.route[0].properties.speedRestrictions);
      // response.data.route.forEach((item) => {
      //   console.log(item.properties.speedRestrictions.maximumSpeed.value);
      //   setSpeedLimit(item.properties.speedRestrictions.maximumSpeed.value);
      // });

      setMostFrequentSpeedLimit(response.data.route);

      lastCallTimeRef.current = now;
      lastLocationRef.current = coords;
    } catch (error) {
      console.log(error);
    }
  };
  
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.BestForNavigation,
          timeInterval: 1000,
          distanceInterval: 1,
        },
        ({ coords }) => {
          const { latitude, longitude, speed, heading } = coords;
          // 33.41656574607349, -111.89151272680259
          // const {speed} = coords;
          // let latitude = 33.41656574607349;
          // let longitude = -111.89151272680259;
          // let heading = 0;
          const currentSpeedKmh = speed * 3.6;
          setSpeedKmh(currentSpeedKmh >= 0 ? currentSpeedKmh : 0);
          if (heading !== -1) { // Make sure heading is valid
            console.log("in if")
            getSpeedLimit({ latitude, longitude }, heading);
          }
        }
      );
    })();
  }, []);

  const speedLimitMph = speedLimit; // Speed limit is initially in mph
  const speedLimitKmh = speedLimit * 1.60934; // Convert speed limit to km/h for comparison if needed

  const currentSpeedKmh = speedKmh; // Assuming speedKmh is your speed in km/h
  const currentSpeedMph = speedKmh * 0.621371; // Convert speed to mph for comparison and display if useMph is true

  const currentSpeed = useMph ? currentSpeedMph: currentSpeedKmh; // Choose the current speed based on the unit selection
  const limit = useMph ? speedLimitMph : speedLimitKmh; // Use the appropriate speed limit based on the unit

  // Determine the speed color based on how the current speed compares to the speed limit (with threshold)
  const threshold = 5; // Threshold for speed limit comparison
  const speedColor = !limit? '#fff' : currentSpeed <= limit - threshold ? '#30b455' : // Below speed limit minus threshold
                    currentSpeed >= limit + threshold ? '#d9534f' : // Above speed limit plus threshold
                    '#e3b23c'; // Within threshold

  const unitSelectionStyle = (isSelected) => ({
    opacity: isSelected ? 1 : 0.5,
    // color: isSelected ? speedColor : '#000',
    color: speedColor,
    paddingVertical: 2,
    fontSize: 30,
  });

  return (
    <View style={styles.container}>
      <View style={styles.speedDisplay}>
        <AntDesign
          name={!limit? 'clockcircleo' : currentSpeed <= limit - threshold ? 'forward' : // Below speed limit minus threshold
          currentSpeed >= limit + threshold ? 'rocket1' : // Above speed limit plus threshold
          'checkcircle'}
          size={42}
          color={speedColor}
        />
        <Text
          style={[
            styles.speedText,
            {
              color: speedColor,
              shadowColor: speedColor,
              textShadowColor: speedColor,
            },
          ]}
        >
          {errorMsg || `${Math.round(currentSpeed)}`}
        </Text>
        <View style={styles.unitButtons}>
          <TouchableOpacity onPress={() => setUseMph(true)}>
            <Text style={unitSelectionStyle(useMph)}>mph</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setUseMph(false)}>
            <Text style={unitSelectionStyle(!useMph)}>km/h</Text>
          </TouchableOpacity>
        </View>
      </View>
      <Text
        style={[styles.speedLimitText, { color: speedColor }]}
      >{`Limit: ${limit.toFixed(1)} ${useMph ? "mph" : "km/h"}`}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'flex-start',
    height: 'auto',
    width: '100%',
    paddingTop: '30%',
  },
  speedDisplay: {
    width: '100%',
    flexDirection: 'column',
    alignItems: 'center',
  },
  speedText: {
    fontSize: 130, // Increased size for emphasis
    fontWeight: 'bold',
    marginHorizontal: 14,
    // iOS Shadow Properties for Glow
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    // Android Text Shadow Properties for Glow
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 5,
    elevation: 5,
  },
  speedLimitText: {
    marginTop: 20,
    fontSize: 24,
    fontWeight: 'bold',
  },
  unitButtons: {
    // Vertical layout for mph and km/h buttons
    // fontSize: 44,
    // alignItems: 'flex-start',
    // justifyContent: 'center',
    // Horizontal layout
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    width: '80%',
    // backgroundColor: '#fff'
  },
});

export default Speedometer;
