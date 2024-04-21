import React, { useState } from "react";
import { View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import Home from "./src/Home";
import Login from "./src/Login";
import Signup from "./src/Signup";
import {
  useFonts,
  Montserrat_400Regular,
  Montserrat_700Bold,
} from "@expo-google-fonts/montserrat";

const Stack = createStackNavigator();

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  let [fontsLoaded] = useFonts({
    Montserrat_400Regular,
    Montserrat_700Bold,
  });

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  if (!fontsLoaded) {
    return <View></View>;
  } else {
    return (
      <NavigationContainer>
        <Stack.Navigator>
          {isLoggedIn ? (
            <Stack.Screen
              name="Home"
              options={{ title: "Home", headerShown: false }}
            >
              {(props) => <Home {...props} onSignOut={handleLogout} />}
            </Stack.Screen>
          ) : (
            <>
              <Stack.Screen
                name="Login"
                options={{ title: "Login", headerShown: false }}
              >
                {(props) => <Login {...props} onLogin={handleLogin} />}
              </Stack.Screen>
              <Stack.Screen
                name="Signup"
                options={{ title: "Signup", headerShown: true }}
              >
                {(props) => <Signup {...props} onSignUpSuccess={handleLogin} />}
              </Stack.Screen>
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}

export default App;
