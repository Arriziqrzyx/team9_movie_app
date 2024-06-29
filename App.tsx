import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { ThemeProvider } from './src/context/ThemeContext';
import BottomTabNavigator from './src/navigations/BottomTabNavigation';

const App = () => {
  return (
    <ThemeProvider>
      <NavigationContainer>
        <BottomTabNavigator />
      </NavigationContainer>
    </ThemeProvider>
  );
};

export default App;
