import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Home from './src/Home';
import Login from './src/Login';
import Signup from './src/Signup';

const Stack = createStackNavigator();

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {isLoggedIn ? (
          <Stack.Screen
            name="Home"
            options={{ title: 'Home', headerShown: false}}
        >
          {(props) => <Home {...props} onSignOut={handleLogout} />}
          </Stack.Screen>
        ) : (
          <>
            <Stack.Screen
              name="Login"
              options={{ title: 'Login', headerShown: false }}
            >
              {(props) => <Login {...props} onLogin={handleLogin} />}
            </Stack.Screen>
            <Stack.Screen
              name="Signup"
              options={{ title: 'Signup', headerShown: true }}
            >
              {(props) => <Signup {...props} onSignUpSuccess={handleLogin} />}
            </Stack.Screen>
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;