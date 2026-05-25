import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { enableScreens } from 'react-native-screens';

// Aktifkan kembali screens karena library pendukung sudah lengkap
enableScreens(true);

import HomeScreen from './pages/HomeScreen';
import HistoryScreen from './pages/HistoryScreen';
import AboutScreen from './pages/AboutScreen';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'Home') {
              iconName = focused ? 'qr-code' : 'qr-code-outline';
            }
            else if (route.name === 'HistoryTab') {
              iconName = focused ? 'time' : 'time-outline';
            }
            else if (route.name === 'AboutTab') {
              iconName = focused ? 'person' : 'person-outline';
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#007bff',
          tabBarInactiveTintColor: 'gray',
          headerShown: false,
        })}
      >
        <Tab.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: 'Scanner' }}
        />

        <Tab.Screen
          name="HistoryTab"
          component={HistoryScreen}
          options={{ title: 'Riwayat' }}
        />

        <Tab.Screen
          name="AboutTab"
          component={AboutScreen}
          options={{ title: 'Tentang' }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}