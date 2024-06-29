import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Favorite from '../screens/Favorite';
import MovieDetail from '../screens/MovieDetail';
import { RootStackParamList } from './HomeStackNavigation';
import { useTheme } from '../context/ThemeContext';

const Stack = createNativeStackNavigator<RootStackParamList>();

const FavoriteStackNavigation = (): JSX.Element => {
  const { isDarkMode } = useTheme();

  const headerStyle = {
    backgroundColor: isDarkMode ? '#151515' : 'white', // Adjust based on dark mode status
  };

  const headerTintColor = isDarkMode ? 'white' : 'black'; // Adjust based on dark mode status

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Favorite"
        component={Favorite}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="MovieDetail"
        component={MovieDetail}
        options={{
          headerShown: true,
          title: 'Movie Detail',
          headerStyle,
          headerTintColor,
        }}
      />
    </Stack.Navigator>
  );
};

export default FavoriteStackNavigation;
