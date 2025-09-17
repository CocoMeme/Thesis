import React, { useState, useEffect } from 'react';
import { NavigationContainer, useFocusEffect } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ActivityIndicator, View, Alert } from 'react-native';

import { HomeScreen, CameraScreen, HistoryScreen, LoginScreen, SignUpScreen, ProfileScreen } from '../screens';
import { authService } from '../services';
import { CustomHeader } from '../components';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const HomeStack = () => {
  const [user, setUser] = React.useState(null);

  React.useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const userData = await authService.getCurrentUser();
      setUser(userData);
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const handleNotificationPress = () => {
    Alert.alert('Notifications', 'Notification feature coming soon!');
  };

  const handleMenuPress = () => {
    Alert.alert(
      'Menu Options', 
      'What would you like to do?',
      [
        { text: 'Settings', onPress: () => console.log('Settings pressed') },
        { text: 'Help', onPress: () => console.log('Help pressed') },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  return (
    <Stack.Navigator
      screenOptions={{
        headerTitleStyle: {
          fontFamily: 'Poppins_600SemiBold',
          fontSize: 18,
        },
      }}
    >
      <Stack.Screen 
        name="HomeMain" 
        component={HomeScreen} 
        options={{
          header: () => (
            <CustomHeader
              user={user}
              onNotificationPress={handleNotificationPress}
              onMenuPress={handleMenuPress}
            />
          ),
        }}
      />
    </Stack.Navigator>
  );
};

const CameraStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerTitleStyle: {
          fontFamily: 'Poppins_600SemiBold',
          fontSize: 18,
        },
      }}
    >
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
    <Stack.Navigator
      screenOptions={{
        headerTitleStyle: {
          fontFamily: 'Poppins_600SemiBold',
          fontSize: 18,
        },
      }}
    >
      <Stack.Screen 
        name="HistoryMain" 
        component={HistoryScreen} 
        options={{ title: 'History' }}
      />
    </Stack.Navigator>
  );
};

const ProfileStack = ({ onAuthChange }) => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerTitleStyle: {
          fontFamily: 'Poppins_600SemiBold',
          fontSize: 18,
        },
      }}
    >
      <Stack.Screen 
        name="ProfileMain" 
        options={{ title: 'Profile' }}
      >
        {(props) => <ProfileScreen {...props} onAuthChange={onAuthChange} />}
      </Stack.Screen>
    </Stack.Navigator>
  );
};

// Auth Stack for login/signup screens
const AuthStack = ({ onAuthSuccess }) => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login">
        {(props) => <LoginScreen {...props} onAuthSuccess={onAuthSuccess} />}
      </Stack.Screen>
      <Stack.Screen name="SignUp">
        {(props) => <SignUpScreen {...props} onAuthSuccess={onAuthSuccess} />}
      </Stack.Screen>
    </Stack.Navigator>
  );
};

// Main Tab Navigator (protected)
const MainTabs = ({ onAuthChange }) => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = 'view-dashboard';
          } else if (route.name === 'Camera') {
            iconName = 'camera';
          } else if (route.name === 'History') {
            iconName = 'history';
          } else if (route.name === 'Profile') {
            iconName = 'account-box';
          }

          return <MaterialCommunityIcons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#4CAF50',
        tabBarInactiveTintColor: 'gray',
        tabBarLabelStyle: {
          fontFamily: 'Poppins_500Medium',
          fontSize: 12,
        },
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={HomeStack} />
      <Tab.Screen name="Camera" component={CameraStack} />
      <Tab.Screen name="History" component={HistoryStack} />
      <Tab.Screen 
        name="Profile"
      >
        {(props) => <ProfileStack {...props} onAuthChange={onAuthChange} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
};

export const AppNavigator = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check authentication status on app start
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const isAuth = await authService.initialize();
      setIsAuthenticated(isAuth);
    } catch (error) {
      console.error('Error checking auth status:', error);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAuthChange = () => {
    // Force re-check authentication status
    setIsLoading(true);
    checkAuthStatus();
  };

  // Show loading screen while checking auth
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f5f5f5' }}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isAuthenticated ? (
          <Stack.Screen name="Main">
            {(props) => <MainTabs {...props} onAuthChange={handleAuthChange} />}
          </Stack.Screen>
        ) : (
          <Stack.Screen name="Auth">
            {(props) => <AuthStack {...props} onAuthSuccess={handleAuthChange} />}
          </Stack.Screen>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};