import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { MaterialIcons } from '@expo/vector-icons';

import { HomeScreen, CameraScreen, HistoryScreen } from '../screens';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const HomeStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="HomeMain" 
        component={HomeScreen} 
        options={{ title: 'Gourd Scanner' }}
      />
    </Stack.Navigator>
  );
};

const CameraStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="CameraMain" 
        component={CameraScreen} 
        options={{ title: 'Scan Gourd' }}
      />
    </Stack.Navigator>
  );
};

const HistoryStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="HistoryMain" 
        component={HistoryScreen} 
        options={{ title: 'History' }}
      />
    </Stack.Navigator>
  );
};

export const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'Home') {
              iconName = 'home';
            } else if (route.name === 'Camera') {
              iconName = 'camera';
            } else if (route.name === 'History') {
              iconName = 'history';
            }

            return <MaterialIcons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#4CAF50',
          tabBarInactiveTintColor: 'gray',
          headerShown: false,
        })}
      >
        <Tab.Screen name="Home" component={HomeStack} />
        <Tab.Screen name="Camera" component={CameraStack} />
        <Tab.Screen name="History" component={HistoryStack} />
      </Tab.Navigator>
    </NavigationContainer>
  );
};