/* eslint-disable prettier/prettier */
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import {NavigationContainer} from '@react-navigation/native';
import React from 'react';
import MyStack from './src/component/Navigation';
import {UserProvider} from './src/component/Login/UserContext';

function App(): React.JSX.Element {
  return (
    <UserProvider>
      <NavigationContainer>
        <MyStack />
      </NavigationContainer>
    </UserProvider>
  );
}

export default App;
