import React, { useState, useEffect } from 'react';
import { FlatList, TouchableOpacity, Linking, StyleSheet, Image, View } from 'react-native';
import { Container, Text, Button } from 'native-base';
import { Buckets, Client, KeyInfo, ThreadID  } from '@textile/hub';

import { USER_DEMO_ETH_ADR_G } from 'react-native-dotenv';
import {
  getWeb3,
  getAdContract,
  enableNewUser,
  getActiveCampaignIds,
  getAd,
  onAdRender
} from './contractUtils';
import {
  getCachedTripThread,
  cacheTripThread,
  tripSchema
} from './helpers';
import stylesheet from './stylesheet';

const tripData = require('./assets/demoTrip.json');
const customData = require('./assets/demoTrip.json');

export default function Trips(props) {
  const {
    db,
    username,
    socialHandle,
    age,
    occupancy
  } = props;
  const [showTrip, setShowTrip] = useState(false);
  const [coordinates, setCoordinates] = useState();
  const [threadId, setThreadId] = useState();
  const [tripPoint, setTripPoint] = useState();
  const [ad, setAd] = useState();
  const [adInfo, setAdInfo] = useState();

  useEffect(() => {
    const setCollection = async () => {
      let cachedThreadId = await getCachedTripThread();
      console.log('AAA', cachedThreadId)
      if (cachedThreadId) setThreadId(cachedThreadId);
      if (!cachedThreadId) {
        cachedThreadId = ThreadID.fromRandom();
        await cacheTripThread(cachedThreadId);
        await db.newDB(cachedThreadId);
        await db.newCollection(cachedThreadId, 'Trip', tripSchema);
        await db.context.withThread(cachedThreadId.toString());
        console.log(cachedThreadId);
        setThreadId(cachedThreadId);
        console.log("FINISHED")
      }
    }
    setCollection();
    const coordArr = tripData.route.features.map((trip) => trip.geometry.coordinates);
    setCoordinates(coordArr);
  }, []);

  const showAd = async () => {
    const web3 = await getWeb3();
    console.log(1, web3)
    const mobilityInstance = await getAdContract(web3);
    console.log(2, mobilityInstance)
    const activeCampaignIds = await getActiveCampaignIds(mobilityInstance);
    console.log(3, activeCampaignIds)
    const advert = await getAd(mobilityInstance, activeCampaignIds);
    console.log(4, adver)

    // onAdRender(advert.data.key, {
    //   username,
    //   socialHandle,
    //   age,
    //   occupancy
    // });
    setAd(advert.ad);
    setAdInfo(advert.title)
  }

  const addTrip = async () => {
    console.log("here")
    const timestamps = tripData.route.features.map((trip) => trip.properties.timestamp);
    let completedTrip;
    console.log('ahahahahah', threadId)
    try {
      const completedTrip = await db.create(threadId, 'Trip', [{
        _id: '50',
        userEthAddress: '0x48C0b9F29aCe4d18C9a394E6d76b1de855830A6a',
        userId: '0x48C0b9F29aCe4d18C9a394E6d76b1de855830A6a',
        coordinates,
        timestamps,
      }]);
      console.log(completedTrip);
      showAd();
    } catch(err) {
      console.log(err.message)
    }
  }

  const startTrip = () => {
    setShowTrip(true);
    let index = 0;
    let tripInterval = setInterval(() => {
      if (!coordinates[index]) {
        clearInterval(tripInterval);
        setTripPoint('Finished Trip');
        addTrip();
      } else {
        setTripPoint(`${coordinates[index][0]}, ${coordinates[index][1]}`)
        index++;
      }
    }, 300);
  }

  return (
    <Container style={stylesheet.container}>
      { !showTrip
       ? <Button onPress={() => startTrip()} light>
          <Text style={stylesheet.text}>Start Trip</Text>
        </Button>
       : <Text style={stylesheet.text}>{tripPoint}</Text>
     }
     { ad
      ? <View>
          <Image
            style={stylesheet.adImg}
            source={{
              uri:
                ad,
            }}
          />
          <Text style={stylesheet.text}>You've received a reward from {adInfo}!</Text>
        </View>
      : null
    }
    </Container>
  );
}
