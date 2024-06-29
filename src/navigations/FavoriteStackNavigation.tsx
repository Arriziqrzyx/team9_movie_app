import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Favorite from '../screens/Favorite';
import MovieDetail from '../screens/MovieDetail';
import { RootStackParamList } from './HomeStackNavigation';

const Stack = createNativeStackNavigator<RootStackParamList>();

const FavoriteStackNavigation = (): JSX.Element => (
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
        title: 'Movie Detail'
      }}
    />
  </Stack.Navigator>
);

export default FavoriteStackNavigation;
