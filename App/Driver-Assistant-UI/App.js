import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Home from './src/Home';
import Login from './src/Login';

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
            component={Home}
            options={{ title: 'Home', headerShown: false}}
          />
        ) : (
          <Stack.Screen
            name="Login"
            options={{ title: 'Login' }}
          >
            {(props) => <Login {...props} onLogin={handleLogin} />}
          </Stack.Screen>
        )}
        <Stack.Screen
          name="Settings"
          options={{ title: 'Settings' }}
        >
          {(props) => <Settings {...props} onSignOut={handleLogout} />}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
