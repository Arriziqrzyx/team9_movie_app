import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Search from '../screens/Search';
import MovieDetail from '../screens/MovieDetail';
import MovieCategory from '../screens/MovieCategory';

type SearchStackParamList = {
  Search: undefined;
  MovieDetail: { id: number };
  MovieCategory: { categoryId: number; categoryName: string };
};

const Stack = createNativeStackNavigator<SearchStackParamList>();

const SearchStackNavigation = (): JSX.Element => (
  <Stack.Navigator initialRouteName="Search">
    <Stack.Screen
      name="Search"
      component={Search}
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
    <Stack.Screen
      name="MovieCategory"
      component={MovieCategory}
      options={{ 
        headerShown: true,
        title: 'Movie Category',
      }}
    />
  </Stack.Navigator>
);

export default SearchStackNavigation;
export type { SearchStackParamList };