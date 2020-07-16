import React, { useState, useEffect } from 'react';
import { FlatList, TouchableOpacity, Linking, StyleSheet } from 'react-native';
import { Container, Text, Button } from 'native-base';
import { Buckets, Client, KeyInfo, ThreadID  } from '@textile/hub';

const customData = require('./lib/demoTrip.json');
import {
  getCachedTripThread,
  cacheTripThread,
} from './helpers';

import stylesheet from './stylesheet';

export default function Trips(props) {
  const { db } = props;

  useEffect(() => {
    const setCollection = async () => {
      const cachedThreadId = await getCachedTripThread()

      if (!cachedThreadId) {
        cachedThreadId = ThreadID.fromRandom();
        await cacheTripThread(cachedThreadId);
        await userDb.newDB(cachedThreadId);
        // @TODO create tripScheme and get trip format function
        await userDb.newCollection(cachedThreadId, 'Trip', tripSchema);
      }
    }
  }, []);

  const addTrip = () => {
    console.log('here');
  }

  return (
    <Container style={stylesheet.container}>
      <Button onPress={() => addTrip()}>
        <Text>Start Trip</Text>
      </Button>
    </Container>
  );
}
