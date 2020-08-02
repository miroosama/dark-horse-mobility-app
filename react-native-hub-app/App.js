/**
 * @format
 * @flow strict-local
 */

import React from 'react';
import {StyleSheet, View, StatusBar, Image } from 'react-native';
import { Header, Text } from 'native-base';
import Login from './src/Login';

const logo = require('./public/dark-horse-logo.png');

const App: () => React$Node = () => {
  return (
    <View style={styles.container}>
      <Header style={styles.header}>
        <Image
          style={styles.headerImg}
          source={logo}
        />
      </Header>
      <Login />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  text: {
    color: 'white'
  },
  header: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#424242'
  },
  headerImg: {
    width: 80,
    height: 80,
    bottom: 10
  }
});

export default App;
