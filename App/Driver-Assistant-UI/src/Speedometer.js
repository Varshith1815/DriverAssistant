import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, Switch, TouchableOpacity  } from 'react-native';
import * as Location from 'expo-location';
import { LinearGradient } from 'expo-linear-gradient';
import { AntDesign } from '@expo/vector-icons';
import axios from 'axios';
import * as Speech from 'expo-speech';
import GamificationManager from './GamificationManager';

const Speedometer = () => {
  const [speedKmh, setSpeedKmh] = useState(0);
  const [useMph, setUseMph] = useState(true);
  const [speedLimit, setSpeedLimit] = useState(0);
  const [isOverSpeeding, setIsOverSpeeding] = useState(false);
  const wasOverSpeedingRef = useRef(false);
  const overspeedingTimerRef = useRef(null);
  const hasStartedDrivingRef = useRef(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const lastLocationRef = useRef(null);
  const lastCallTimeRef = useRef(0);
  const callInterval = 6000;

  const [speedLimitMph, setSpeedLimitMph] = useState(speedLimit);
  const [speedLimitKmh, setSpeedLimitKmh] = useState(speedLimit * 1.60934);
  const [currentSpeedKmh, setCurrentSpeedKmh] = useState(speedKmh);
  const [currentSpeedMph, setCurrentSpeedMph] = useState(speedKmh * 0.621371);
  const [threshold, setThreshold] = useState(10);
  const [limit, setLimit] = useState(useMph ? speedLimitMph : speedLimitKmh);
  const [currentSpeed, setCurrentSpeed] = useState(useMph ? currentSpeedMph : currentSpeedKmh);
  const [speedColor, setSpeedColor] = useState("#fff");

  const API_KEY = 'c63IvblzdGjwYAe8HLcEbunVMGIi5LGr';

  const gamification = new GamificationManager();

  useEffect(() => {
    setSpeedLimitMph(speedLimit);
    setSpeedLimitKmh(speedLimit * 1.60934);
  }, [speedLimit]);
  
  useEffect(() => {
    setCurrentSpeedKmh(speedKmh);
    setCurrentSpeedMph(speedKmh * 0.621371);
  }, [speedKmh]);
  
  useEffect(() => {
    setLimit(useMph ? speedLimitMph : speedLimitKmh);
  }, [useMph, speedLimitMph, speedLimitKmh]);

  useEffect(() => {
    setCurrentSpeed(useMph ? currentSpeedMph : currentSpeedKmh);
  }, [useMph, currentSpeedMph, currentSpeedKmh]);
  
  useEffect(() => {
    setSpeedColor(() => {
      if (!limit) return '#fff';
      if (currentSpeed <= limit - threshold) return '#7DF9FF';
      if (currentSpeed <= limit) return '#30b455';
      if (currentSpeed >= limit + threshold) return '#d9534f';
      return '#e3b23c';
    });
  }, [currentSpeed, limit, threshold]);

  const projectPoint = (latitude, longitude, distance, heading) => {
    const degreesToRadians = Math.PI / 180;
    const radiansToDegrees = 180 / Math.PI;
    const earthRadiusInMeters = 6378137;
    const distRatio = distance / earthRadiusInMeters;
    const bearing = heading * degreesToRadians;

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
    const earthRadiusKm = 6371; 

    const dLat = (coords2.latitude - coords1.latitude) * degreesToRadians;
    const dLon = (coords2.longitude - coords1.longitude) * degreesToRadians;

    const lat1 = coords1.latitude * degreesToRadians;
    const lat2 = coords2.latitude * degreesToRadians;

    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2); 
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    const distanceKm = earthRadiusKm * c;

    return distanceKm * 1000; 
  };

  const setMostFrequentSpeedLimit = (route) => {
    const speedLimitCounts = route.reduce((acc, item) => {
      const speedValue = item.properties.speedRestrictions.maximumSpeed?.value || 0;
      if (acc[speedValue]) {
        acc[speedValue] += 1;
      } else {
        acc[speedValue] = 1;
      }
      return acc;
    }, {});

    console.log("speedLimitCounts: ", speedLimitCounts)

    if (Object.keys(speedLimitCounts).length === 0) {
      setSpeedLimit(parseInt(0, 10));
      return;
    }

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

    try {
      const projectedCoords = projectPoint(coords.latitude, coords.longitude, 300, heading); // 300 meters ahead based on current heading
      const coordinatesParameter = `${coords.longitude},${coords.latitude};${projectedCoords.longitude},${projectedCoords.latitude}`;
      const headingsParameter = `${heading};${heading}`;

      const apiUrl = `https://api.tomtom.com/snap-to-roads/1/snap-to-roads?points=${coordinatesParameter}&headings=${headingsParameter}&fields={route{type,geometry{type,coordinates},properties{id,speedRestrictions{maximumSpeed{value,unit}}}}}&key=${API_KEY}`;
      const response = await axios.get(apiUrl);

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
            getSpeedLimit({ latitude, longitude }, heading);
          }
        }
      );
    })();
  }, []);

  useEffect(() => {
    if(currentSpeedMph > 10 && limit !== 0) {
      console.log("Current Speed: ", currentSpeedMph, "Limit: ", limit);
      setIsOverSpeeding(currentSpeedMph >= limit + threshold);
    } else if(hasStartedDrivingRef.current && (currentSpeedMph < 10 || limit === 0)) {
      isOverSpeeding ? gamification.stopOverSpeeding() : gamification.stopGoodDrivingSession();
      hasStartedDrivingRef.current = false;
    }
  }, [currentSpeedMph, limit, threshold, isOverSpeeding]);

  useEffect(() => {
    const clearOverspeedingTimer = () => {
        if (overspeedingTimerRef.current) {
            clearTimeout(overspeedingTimerRef.current);
            overspeedingTimerRef.current = null;
        }
    };

    if (isOverSpeeding) {
        if (!wasOverSpeedingRef.current) {
            console.log("Overspeeding");
            Speech.speak("You are overspeeding. Please slow down.");
            wasOverSpeedingRef.current = true;
            hasStartedDrivingRef.current = true;
            gamification.stopGoodDrivingSession();
            gamification.startOverSpeeding();
        } else if (!hasStartedDrivingRef.current && limit !== 0 && currentSpeedMph > 10) {
          gamification.startOverSpeeding();
          hasStartedDrivingRef.current = true;
      }

        clearOverspeedingTimer();
        overspeedingTimerRef.current = setTimeout(() => {
            console.log("Still overspeeding");
            Speech.speak("You are still overspeeding. Please slow down.");
        }, 10000);
    } else {
        if (wasOverSpeedingRef.current) {
            wasOverSpeedingRef.current = false;
            Speech.stop();
            clearOverspeedingTimer();
            gamification.stopOverSpeeding();
            gamification.startGoodDrivingSession();
        } else if (!hasStartedDrivingRef.current && limit !== 0 && currentSpeedMph > 10) {
          gamification.startGoodDrivingSession();
          hasStartedDrivingRef.current = true;
      }
    }

    return clearOverspeedingTimer;
  }, [isOverSpeeding, currentSpeedMph]);
  const unitSelectionStyle = (isSelected) => ({
    opacity: isSelected ? 1 : 0.5,
    color: speedColor,
    paddingVertical: 2,
    fontSize: 30,
  });


  return (
    <LinearGradient
      colors={["#0f0c29", "#0f0c29", "#121212"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={styles.linearGradient}
    >
      <View style={styles.container}>
        <View style={styles.speedDisplay}>
          <AntDesign
            name={
              !limit
                ? "clockcircleo"
                : currentSpeed <= limit - threshold
                ? "forward"
                : currentSpeed >= limit + threshold
                ? "rocket1"
                : "checkcircle"
            }
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
        <View style={styles.speedLimitSign}>
          <Text style={styles.signText}>SPEED</Text>
          <Text style={styles.signText}>LIMIT</Text>
          <Text
            style={[styles.signLimitValue, { color: "black" }]}
          >{`${limit === 0 ? '-' : Math.round(limit)}`}</Text>
        </View>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    fontSize: 130,
    fontWeight: 'bold',
    marginHorizontal: 14,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    width: '80%',
  },
  speedLimitSign: {
    marginTop: '15%',
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: 'black',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  signText: {
    fontSize: 18,
    color: 'black',
    fontWeight: 'bold',
  },
  signLimitValue: {
    fontSize: 44,
    fontWeight: 'bold',
    marginTop: 0,
  },
  linearGradient: {
    flex: 1,
  },
});

export default Speedometer;
