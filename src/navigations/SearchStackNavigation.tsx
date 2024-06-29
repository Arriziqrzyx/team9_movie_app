import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Search from '../screens/Search';
import MovieDetail from '../screens/MovieDetail';
import MovieCategory from '../screens/MovieCategory';
import { useTheme } from '../context/ThemeContext';

type SearchStackParamList = {
  Search: undefined;
  MovieDetail: { id: number };
  MovieCategory: { categoryId: number; categoryName: string };
};

const Stack = createNativeStackNavigator<SearchStackParamList>();

const SearchStackNavigation = (): JSX.Element => {
  const { isDarkMode } = useTheme();

  const headerStyle = {
    backgroundColor: isDarkMode ? '#151515' : 'white',
  };

  const headerTintColor = isDarkMode ? 'white' : 'black'; 

  return (
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
          title: 'Movie Detail',
          headerStyle,
          headerTintColor,
        }}
      />
      <Stack.Screen
        name="MovieCategory"
        component={MovieCategory}
        options={{
          headerShown: true,
          title: 'Movie Category',
          headerStyle,
          headerTintColor,
        }}
      />
    </Stack.Navigator>
  );
};

export default SearchStackNavigation;
export type { SearchStackParamList };
