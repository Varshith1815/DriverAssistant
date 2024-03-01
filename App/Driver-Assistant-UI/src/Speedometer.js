import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import * as Location from 'expo-location';

const Speedometer = () => {
  const [speedKmh, setSpeedKmh] = useState(0);
  const [speedMph, setSpeedMph] = useState(0);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.BestForNavigation, // Use the best accuracy for navigation
          timeInterval: 500, // Lower time interval to 500ms for more frequent updates
          distanceInterval: 1, // Set distance interval to 1 meter for more responsive updates
        },
        (location) => {
          const currentSpeedKmh = location.coords.speed * 3.6; // Convert m/s to km/h
          const currentSpeedMph = currentSpeedKmh / 1.60934; // Convert km/h to mph
          setSpeedKmh(currentSpeedKmh >= 0 ? currentSpeedKmh : 0); // Sometimes speed might be negative
          setSpeedMph(currentSpeedMph >= 0 ? currentSpeedMph : 0);
        }
      );
    })();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.speedText}>{errorMsg || `${speedKmh.toFixed(1)} km/h`}</Text>
      <Text style={styles.speedText}>{errorMsg || `${speedMph.toFixed(1)} miles/h`}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    alignItems: 'center',
    justifyContent: 'center',
  },
  speedText: {
    color: '#FFFFFF',
    fontSize: 24,
  },
});

export default Speedometer;