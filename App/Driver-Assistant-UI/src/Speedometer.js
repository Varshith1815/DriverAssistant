import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import * as Location from 'expo-location';

const Speedometer = () => {
  const [speed, setSpeed] = useState(0);
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
          const currentSpeed = location.coords.speed * 3.6; // Convert m/s to km/h
          setSpeed(currentSpeed >= 0 ? currentSpeed : 0); // Sometimes speed might be negative
        }
      );
    })();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.speedText}>{errorMsg || `${speed.toFixed(1)} km/h`}</Text>
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
