import React, { useState, useEffect, useRef } from 'react';
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
  onAdRender,
  getRewards
} from './contractUtils';
import {
  getCachedTripThread,
  cacheTripThread,
  tripSchema
} from './helpers';
import stylesheet from './stylesheet';

const uuid = require('react-native-uuid');
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
  const [tripPoint, setTripPoint] = useState();
  const [ad, setAd] = useState();
  const [adInfo, setAdInfo] = useState();
  const [rewardInfo, setRewardInfo] = useState(false);
  const threadRef = useRef();

  useEffect(() => {
    const setCollection = async () => {
      let cachedThreadId = await getCachedTripThread();
      console.log('AAA', cachedThreadId)
      if (!cachedThreadId) {
        cachedThreadId = ThreadID.fromRandom();
        await cacheTripThread(cachedThreadId);
        await db.newDB(cachedThreadId);
        await db.newCollection(cachedThreadId, 'Trip', tripSchema);
        await db.context.withThread(cachedThreadId.toString());
        console.log("FINISHED")
      }
      threadRef.current = cachedThreadId;
    }
    setCollection();
    const coordArr = tripData.route.features.map((trip) => trip.geometry.coordinates);
    setCoordinates(coordArr);
  }, []);

  const showAd = async () => {
    const web3 = await getWeb3();
    const mobilityInstance = await getAdContract(web3);
    const activeCampaignIds = await getActiveCampaignIds(mobilityInstance);
    const advert = await getAd(mobilityInstance, activeCampaignIds);

    onAdRender(advert.data.key, {
      username,
      socialHandle,
      age,
      occupancy
    });
    setAd(advert.ad);
    setAdInfo(advert.organization)
  }

  const addTrip = async () => {
    const timestamps = tripData.route.features.map((trip) => trip.properties.timestamp);
    let completedTrip;
    try {
      const completedTrip = await db.create(threadRef.current, 'Trip', [{
        _id: uuid.v1(),
        userEthAddress: '0x48C0b9F29aCe4d18C9a394E6d76b1de855830A6a',
        userId: '0x48C0b9F29aCe4d18C9a394E6d76b1de855830A6a',
        coordinates,
        timestamps,
      }]);
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
    }, 200);
  }

  const claimReward = async () => {
    const web3 = await getWeb3();
    const mobilityInstance = await getAdContract(web3);
    const rewards = await getRewards(web3, mobilityInstance);
    const newBalance = await web3.eth.getBalance('0x401aF064fcf5387ba77827DEcd0c26D16DBF9D8E');
    const balance = web3.utils.fromWei(newBalance, 'ether');
    setRewardInfo(balance);
  }

  return (
    <Container style={stylesheet.container}>
      { !showTrip && !ad
       ? <Button onPress={() => startTrip()} light>
          <Text style={stylesheet.text}>Start Trip</Text>
        </Button>
       : <Text style={stylesheet.text}>{tripPoint}</Text>
     }
     { ad
      ? <View style={stylesheet.adContainer}>
          <Image
            style={stylesheet.adImg}
            source={{
              uri:
                ad,
            }}
          />
          { !rewardInfo
          ? <View style={stylesheet.rwdContainer}>
              <Text style={stylesheet.text}>You received a reward from {adInfo}!</Text>
              <Button onPress={() => claimReward()} light>
                <Text style={stylesheet.text}>Claim Rewards</Text>
              </Button>
            </View>
          : <Text style={stylesheet.text}>Your new balance is {rewardInfo} ETH!</Text>
          }
        </View>
      : null
    }
    </Container>
  );
}
