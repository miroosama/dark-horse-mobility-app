/**
 * @format
 * @flow strict-local
 */

import React from 'react';
import {StyleSheet, View, StatusBar} from 'react-native';
import { Header, Text } from 'native-base';

import Login from './src/Login';

const App: () => React$Node = () => {
  return (
    <View style={styles.container}>
      <Header>
        <Text>Dark Horse Mobility</Text>
      </Header>
      <Login />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FEFEFE',
  },
});

export default App;
