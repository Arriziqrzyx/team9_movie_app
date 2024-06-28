import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import Home from '../screens/Home'
import MovieDetail from '../screens/MovieDetail'

const Stack = createNativeStackNavigator()

const HomeStackNavigation = (): JSX.Element => (
  <Stack.Navigator>
    <Stack.Screen
      name="Home"
      component={Home}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="MovieDetail"
      component={MovieDetail}
      options={{ headerShown: true }}
    />
  </Stack.Navigator>
)

export default HomeStackNavigation
