import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Feather } from '@expo/vector-icons';
import HomeStackNavigation from './HomeStackNavigation';
import SearchStackNavigation from './SearchStackNavigation';
import FavoriteStackNavigation from './FavoriteStackNavigation';
import { useTheme } from '../context/ThemeContext';
import { StyleSheet } from 'react-native';

const Tab = createBottomTabNavigator();

const BottomTabNavigator = (): JSX.Element => {
  const { isDarkMode } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: isDarkMode ? styles.darkTabBar : styles.lightTabBar,
        tabBarActiveTintColor: isDarkMode ? '#fff' : '#000',
        tabBarInactiveTintColor: isDarkMode ? '#888' : '#888',
      }}
    >
      <Tab.Screen
        name="HomeStack"
        component={HomeStackNavigation}
        options={{
          tabBarIcon: ({ color }) => (
            <Feather name="home" size={26} color={color} />
          ),
          headerShown: false,
          title: 'Home',
        }}
      />
      <Tab.Screen
        name="SearchStack"
        component={SearchStackNavigation}
        options={{
          tabBarIcon: ({ color }) => (
            <Feather name="search" size={26} color={color} />
          ),
          headerShown: false,
          title: 'Search',
        }}
      />
      <Tab.Screen
        name="FavoriteStack"
        component={FavoriteStackNavigation}
        options={{
          tabBarIcon: ({ color }) => (
            <Feather name="heart" size={26} color={color} />
          ),
          headerShown: false,
          title: 'Favorite',
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  darkTabBar: {
    backgroundColor: '#000',
    borderTopColor: '#333',
  },
  lightTabBar: {
    backgroundColor: '#fff',
    borderTopColor: '#ccc',
  },
});

export default BottomTabNavigator;
