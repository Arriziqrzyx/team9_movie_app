import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import Home from '../screens/Home'
import MovieDetail from '../screens/MovieDetail'
import { Image } from 'react-native'

const Stack = createNativeStackNavigator<RootStackParamList>();

export type RootStackParamList = {
  Home: undefined;
  MovieDetail: { id: number };
  Favorite: undefined;
};

const HomeStackNavigation = (): JSX.Element => (
  <Stack.Navigator>
    <Stack.Screen
      name="Home"
      component={Home}
      options={{
        headerShown: true,
        headerTitle: () => (
          <Image
            source={require('../../assets/logo.png')}
            style={{ width: 120, height: 55 }}
            resizeMode="contain"
          />
        ),
        headerTitleAlign: 'center',
      }}
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
)

export default HomeStackNavigation
