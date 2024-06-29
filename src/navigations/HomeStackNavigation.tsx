import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Image, TouchableOpacity, View, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import Home from '../screens/Home';
import MovieDetail from '../screens/MovieDetail';

const Stack = createNativeStackNavigator<RootStackParamList>();

export type RootStackParamList = {
  Home: undefined;
  MovieDetail: { id: number };
  Favorite: undefined;
};

const HomeStackNavigation = (): JSX.Element => {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
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
          headerStyle: {
            backgroundColor: isDarkMode ? '#151515' : 'white',
          },
          headerTintColor: isDarkMode ? 'white' : 'black',
          headerRight: () => (
            <TouchableOpacity onPress={toggleTheme} style={styles.iconButton}>
              <View style={[styles.iconContainer, isDarkMode && styles.darkIconContainer]}>
                <FontAwesome
                  name={isDarkMode ? 'sun-o' : 'moon-o'}
                  size={24}
                  color={isDarkMode ? 'white' : 'black'}
                />
              </View>
            </TouchableOpacity>
          ),
        }}
      />
      <Stack.Screen
        name="MovieDetail"
        component={MovieDetail}
        options={{
          headerShown: true,
          title: 'Movie Detail',
          headerStyle: {
            backgroundColor: isDarkMode ? '#151515' : 'white',
          },
          headerTintColor: isDarkMode ? 'white' : 'black',
        }}
      />
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  iconButton: {
    paddingVertical: 8,
  },
  iconContainer: {
    backgroundColor: '#EEEEEE',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 50,
  },
  darkIconContainer: {
    backgroundColor: '#333333',
  },
});

export default HomeStackNavigation;
