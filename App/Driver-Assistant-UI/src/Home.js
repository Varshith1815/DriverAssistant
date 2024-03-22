import React from 'react';
import { StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { AntDesign, Ionicons } from '@expo/vector-icons';

import Speedometer from './Speedometer';
import Leaderboard from './Leaderboard';
import Settings from './Settings';

const Tab = createBottomTabNavigator();

const Home = () => {
  return (
    <LinearGradient
      colors={["#0f0c29", "#0f0c29", "#121212"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={styles.linearGradient}
    >
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === "Speedometer") {
              iconName = "speedometer";
            } else if (route.name === "Leaderboard") {
              iconName = "trophy";
            } else if (route.name === "Settings") {
              iconName = "settings";
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
          headerStyle: {
            backgroundColor: "#16161D", // Header background color
          },
          headerTintColor: "white", // Header title and back button color
          tabBarActiveTintColor: "white",
          tabBarInactiveTintColor: "gray",
          tabBarStyle: [
            {
              display: "flex",
              backgroundColor: "#16161D",
            },
            null,
          ],
        })}
      >
        <Tab.Screen name="Speedometer" component={Speedometer} />
        <Tab.Screen name="Leaderboard" component={Leaderboard} />
        <Tab.Screen name="Settings" component={Settings} />
      </Tab.Navigator>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
    alignItems: 'center',
  },
  linearGradient: {
    flex: 1,
    borderRadius: 5,
  },
});

export default Home;
