import React, { useState, useEffect } from 'react';
import { FlatList, TouchableOpacity, Linking, StyleSheet } from 'react-native';
import { Container, Text, Button } from 'native-base';
import { Buckets, Client, KeyInfo, ThreadID  } from '@textile/hub';
const tripData = require('./assets/demoTrip.json');

const customData = require('./assets/demoTrip.json');
import {
  getCachedTripThread,
  cacheTripThread,
  tripSchema
} from './helpers';

import stylesheet from './stylesheet';

export default function Trips(props) {
  const { db } = props;
  const [showTrip, setShowTrip] = useState(false);
  const [coordinates, setCoordinates] = useState();
  const [threadId, setThreadId] = useState();
  const [tripPoint, setTripPoint] = useState();

  useEffect(() => {
    const setCollection = async () => {
      let cachedThreadId = await getCachedTripThread();

      if (!cachedThreadId) {
        cachedThreadId = ThreadID.fromRandom();
        await cacheTripThread(cachedThreadId);
        await db.newDB(cachedThreadId);
        await db.newCollection(cachedThreadId, 'Trip', tripSchema);
      }
      setThreadId(cachedThreadId);
    }
    setCollection();
    const coordArr = tripData.route.features.map((trip) => trip.geometry.coordinates);
    setCoordinates(coordArr);
  }, []);

  const addTrip = async () => {
    console.log("here")
    const timestamps = tripData.route.features.map((trip) => trip.properties.timestamp);
    // console.log(tripData.user_eth_addr)
    // console.log(tripData.user_id)
    // console.log(coordinates)
    // console.log(timestamps)
    let completedTrip;
    try {
      const completedTrip = await db.create(threadId, 'Trip', [{
        _id: '4',
        userEthAddress: tripData.user_eth_addr,
        userId: tripData.user_id,
        coordinates,
        timestamps,
      }]);
      console.log(completedTrip);
    } catch(err) {
      console.log(err.message)
    }
  }

  const startTrip = () => {
    setShowTrip(true);
    let index = 0;
    let tripInterval = setInterval(() => {
      if (!coordinates[index]) {
        console.log('fin')
        clearInterval(tripInterval);
        setTripPoint('Finished Trip');
        addTrip();
      } else {
        console.log('stillGOin')
        setTripPoint(`${coordinates[index][0]}, ${coordinates[index][1]}`)
        index++;
      }
    }, 300);
  }

  return (
    <Container style={stylesheet.container}>
      { !showTrip
       ? <Button onPress={() => startTrip()}>
          <Text>Start Trip</Text>
        </Button>
       : <Text>{tripPoint}</Text>
     }
    </Container>
  );
}
