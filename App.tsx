import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import DailiesScreen from './src/screens/DailiesScreen';
import HomeScreen from './src/screens/HomeScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import ToDosScreen from './src/screens/ToDosScreen';
import SignInScreen from './src/screens/SignInScreen';

type RootTabParamList = {
  Home: undefined;
  Dailies: undefined;
  ToDos: undefined;
  Profile: undefined;
};

const Tab = createBottomTabNavigator<RootTabParamList>();

const App: React.FC = () => {
  const [isSignedIn, setIsSignedIn] = useState(false);

  return (
    <NavigationContainer>
      {isSignedIn ? (
        <Tab.Navigator
          initialRouteName="Home"
          screenOptions={{
            headerShown: false,
            tabBarLabelStyle: {
              fontSize: 12,
            },
          }}
        >
          <Tab.Screen name="Home" component={HomeScreen} />
          <Tab.Screen name="Dailies" component={DailiesScreen} />
          <Tab.Screen
            name="ToDos"
            component={ToDosScreen}
            options={{
              title: 'To-Dos',
              tabBarLabel: 'To-Dos',
            }}
          />
          <Tab.Screen name="Profile" component={ProfileScreen} />
        </Tab.Navigator>
      ) : (
        <SignInScreen onSignIn={() => setIsSignedIn(true)} />
      )}
    </NavigationContainer>
  );
};

export default App;
