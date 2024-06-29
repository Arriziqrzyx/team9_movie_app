import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Feather } from '@expo/vector-icons';
import HomeStackNavigation from './HomeStackNavigation';
import SearchStackNavigation from './SearchStackNavigation';
import FavoriteStackNavigation from './FavoriteStackNavigation';

const Tab = createBottomTabNavigator();

const BottomTabNavigator = (): JSX.Element => (
  <Tab.Navigator>
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

export default BottomTabNavigator;
