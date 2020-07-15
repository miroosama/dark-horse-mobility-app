import React, { useState, useEffect } from 'react';
import { FlatList, TouchableOpacity, Linking, StyleSheet } from 'react-native';
import { Container, Text, Button } from 'native-base';
const customData = require('./lib/demoTrip.json');

import stylesheet from './stylesheet';

export default function Trips(props) {
  const { db } = props;
  return (
    <Container style={stylesheet.container}>
      <Button>
        <Text>Start Trip</Text>
      </Button>
    </Container>
  );
}
