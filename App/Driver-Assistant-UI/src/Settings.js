// Settings.js
import React from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { View, Text, StyleSheet } from 'react-native';

const Settings = () => {
  return (
    <LinearGradient
      colors={["#0f0c29", "#0f0c29", "#121212"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={styles.linearGradient}
    >
    <View style={styles.container}>
      <Text style={styles.text}>Settings Screen</Text>
    </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: '#121212',
  },
  text: {
    color: 'white',
    fontSize: 20,
  },
  linearGradient: {
    flex: 1,
    // borderRadius: 5,
  },
});

export default Settings;
