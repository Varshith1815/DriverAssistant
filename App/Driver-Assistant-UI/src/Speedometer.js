import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Switch } from 'react-native';
import * as Location from 'expo-location';
import { AntDesign } from '@expo/vector-icons'; // Ensure you have expo/vector-icons installed

const Speedometer = () => {
  const [speedKmh, setSpeedKmh] = useState(0);
  const [useMph, setUseMph] = useState(false); // State to toggle between km/h and mph
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
          accuracy: Location.Accuracy.BestForNavigation,
          timeInterval: 500,
          distanceInterval: 1,
        },
        (location) => {
          const currentSpeedKmh = location.coords.speed * 3.6;
          setSpeedKmh(currentSpeedKmh >= 0 ? currentSpeedKmh : 0);
        }
      );
    })();
  }, []);

  const speed = useMph ? speedKmh / 1.60934 : speedKmh;
  const speedText = speed.toFixed(1) + (useMph ? ' mph' : ' km/h');
  const speedColor = speed < 30 ? '#30b455' : speed < 70 ? '#e3b23c' : '#d9534f';

  return (
    <View style={[styles.container, { borderColor: speedColor }]}>
      <AntDesign name={speed < 30 ? 'caretright' : 'rocket1'} size={48} color={speedColor} />
      <Text style={[styles.speedText, { color: speedColor }]}>{errorMsg || speedText}</Text>
      <Switch
        trackColor={{ false: "#767577", true: "#81b0ff" }}
        thumbColor={useMph ? "#f5dd4b" : "#f4f3f4"}
        onValueChange={() => setUseMph(previousState => !previousState)}
        value={useMph}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    backgroundColor: '#121212',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 5,
    height: 250,
    width: 250,
    borderRadius: 1000, // High value to ensure circular border
    padding: 50, // Adjust based on your needs
  },
  speedText: {
    marginTop: 10,
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default Speedometer;
