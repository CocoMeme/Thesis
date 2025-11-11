import React, { useState, useEffect } from 'react';
import { NavigationContainer, useFocusEffect, DefaultTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ActivityIndicator, View, Alert } from 'react-native';

import { HomeScreen, CameraScreen, ResultsScreen, HistoryScreen, NewsScreen, LoginScreen, SignUpScreen, ProfileScreen, PollinationScreen, PlantFormScreen, PlantDetailScreen } from '../screens';
import { theme } from '../styles';

const TAB_BAR_HEIGHT = 70;

const navigationTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: theme.colors.background.primary,
    card: theme.colors.surface,
    border: theme.colors.background.secondary,
  },
};
import { authService } from '../services';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const HomeStack = ({ route }) => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerTitleStyle: {
          fontFamily: 'Poppins_600SemiBold',
          fontSize: 18,
        },
        headerShown: false,
        statusBarTranslucent: true,
        statusBarStyle: 'light',
        statusBarColor: 'transparent',
        contentStyle: { backgroundColor: theme.colors.background.primary },
      }}
    >
      <Stack.Screen 
        name="HomeMain" 
        initialParams={{ 
          showWelcome: route?.params?.showWelcome,
        }}
      >
        {(props) => <HomeScreen {...props} />}
      </Stack.Screen>
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
      <Stack.Screen 
        name="Results" 
        component={ResultsScreen} 
        options={{ title: 'Scan Results' }}
      />
    </Stack.Navigator>
  );
};

const PollinationStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerTitleStyle: {
          fontFamily: 'Poppins_600SemiBold',
          fontSize: 18,
        },
        headerShown: false,
      }}
    >
      <Stack.Screen 
        name="PollinationMain" 
        component={PollinationScreen} 
        options={{ title: 'Pollination Management' }}
      />
      <Stack.Screen 
        name="PlantForm" 
        component={PlantFormScreen} 
        options={{ 
          title: 'Plant Form',
          headerShown: true,
          presentation: 'modal'
        }}
      />
      <Stack.Screen 
        name="PlantDetail" 
        component={PlantDetailScreen} 
        options={{ 
          title: 'Plant Details',
          headerShown: false
        }}
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

const NewsStack = () => {
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
        name="NewsMain" 
        component={NewsScreen} 
        options={{ title: 'News' }}
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
        headerShown: false,
        statusBarTranslucent: true,
        statusBarStyle: 'light',
        statusBarColor: 'transparent',
        contentStyle: { backgroundColor: theme.colors.background.secondary },
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
const MainTabs = ({ onAuthChange, showWelcome }) => {
  return (
    <Tab.Navigator
      sceneContainerStyle={{ backgroundColor: theme.colors.background.primary }}
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color }) => {
          const iconMap = {
            Home: { active: 'grid', inactive: 'grid-outline' },
            News: { active: 'newspaper', inactive: 'newspaper-outline' },
            Camera: { active: 'camera', inactive: 'camera-outline' },
            Pollination: { active: 'leaf', inactive: 'leaf-outline' },
            History: { active: 'time', inactive: 'time-outline' },
            Profile: { active: 'person', inactive: 'person-outline' },
          };

          const { active, inactive } = iconMap[route.name] || {
            active: 'ellipse',
            inactive: 'ellipse-outline',
          };

          const iconName = focused ? active : inactive;
          const iconSize = focused ? 24 : 20;
          return <Ionicons name={iconName} size={iconSize} color={color} />;
        },
        tabBarActiveTintColor: '#4CAF50',
        tabBarInactiveTintColor: '#9e9e9e',
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
          borderTopWidth: 1,
          borderTopColor: theme.colors.background.secondary,
          height: TAB_BAR_HEIGHT,
          paddingBottom: 12,
          paddingTop: 8,
        },
        tabBarHideOnKeyboard: true,
        headerShown: false,
      })}
    >
      <Tab.Screen 
        name="Home" 
        initialParams={{ showWelcome }}
      >
        {(props) => <HomeStack {...props} />}
      </Tab.Screen>
      <Tab.Screen name="News" component={NewsStack} />
      <Tab.Screen name="Camera" component={CameraStack} />
      <Tab.Screen name="Pollination" component={PollinationStack} />
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
  const [showWelcome, setShowWelcome] = useState(false);

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
    // Force re-check authentication status and show welcome alert
    setShowWelcome(true);
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
    <NavigationContainer theme={navigationTheme}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isAuthenticated ? (
          <Stack.Screen 
            name="Main"
            initialParams={{ showWelcome }}
          >
            {(props) => <MainTabs {...props} onAuthChange={handleAuthChange} showWelcome={showWelcome} />}
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