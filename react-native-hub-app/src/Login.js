import React, { useState, useEffect } from 'react';
import { FlatList, TouchableOpacity, Linking, StyleSheet } from 'react-native';
import { Container, Text, Content, Form, Item, Input, Button } from 'native-base';
import Prompt from 'react-native-input-prompt';

import { USER_API_SECRET, USER_API_KEY, USER_THREAD_ID } from 'react-native-dotenv';

import Filter from 'bad-words';
import { Where } from '@textile/threads-client';
import { Buckets, Client, KeyInfo, ThreadID  } from '@textile/hub';

import {
  generateIdentity,
  getCachedUserThread,
  cacheUserThread,
  userSchema,
  clearAppData
} from './helpers';
import {
  getWeb3,
  getAdContract,
  enableNewUser
} from './contractUtils';
import stylesheet from './stylesheet';
import Trips from './Trips';

export default function Login() {
  const [db, setDb] = useState();
  const [identity, setIdentity] = useState();
  const [threadId, setThreadId] = useState();
  const [message, setMessage] = useState();
  const [openPrompt, setOpenPrompt] = useState(false);
  const [username, setUsername] = useState();
  const [socialHandle, setSocial] = useState();
  const [age, setAge] = useState();
  const [occupancy, setOccupancy] = useState();
  const [createdUser, setCreatedUser] = useState(false);

  const addUserToCampaign = async () => {
    const web3 = await getWeb3();
    const contractInstance = await getAdContract(web3);
    const newUserSet = enableNewUser(web3, contractInstance);
  }

  const createIdentityAndDb = async () => {
    try {
      const id = await generateIdentity();
      const identity = id.toString();
      const info = {
        key: USER_API_KEY,
        secret: USER_API_SECRET
      };
      let userDb = new Client();
      userDb = await Client.withKeyInfo(info);
      await userDb.getToken(id);
      const cachedUserThread = await getCachedUserThread();
      console.log(cachedUserThread)
      if (cachedUserThread) {
        setDb(userDb)
        setIdentity(identity);
        setCreatedUser(true);
      } else {
        const cachedThreadId = ThreadID.fromString(USER_THREAD_ID);
        // const cachedThreadId = ThreadID.fromRandom();

        await cacheUserThread(cachedThreadId.toString());
        console.log(cachedThreadId.toString())
        // await userDb.newDB(cachedThreadId);
        // use same collection
        // await userDb.newCollection(cachedThreadId, 'User', userSchema);

        userDb.context.withThread(cachedThreadId.toString());
        setDb(userDb);
        setIdentity(identity);
        setThreadId(cachedThreadId);
        setOpenPrompt(true);
      }
    } catch (err) {
      setMessage(err.message);
    }
  }

  useEffect(() => {
    createIdentityAndDb();
  }, [])

  const createUser = async () => {
      const ids = await db.create(threadId, 'User', [{
        _id: ``,
        userAddress: '0x48C0b9F29aCe4d18C9a394E6d76b1de855830A6a',
        username,
        socialHandle,
        age: parseInt(age),
        occupancy,
        adRewards: true,
        shareData: true
      }]);
      if (ids.length) {
        addUserToCampaign();
        setOpenPrompt(false);
        setCreatedUser(true);
      }
  }

  const userForm = () => {
    return (
      <Content style={stylesheet.content}>
        <Form>
          <Item>
            <Input
              onChangeText={(val) => setUsername(val)}
              placeholder="Username"
              value={username} />
          </Item>
          <Item>
            <Input
              onChangeText={(val) => setSocial(val)}
              placeholder="Instagram Handle"
              value={socialHandle} />
          </Item>
          <Item>
            <Input
              keyboardType='numeric'
              onChangeText={(val) => setAge(val.replace(/[^0-9]/g, ''))}
              placeholder="Age"
              value={age} />
          </Item>
          <Item>
            <Input
              onChangeText={(val) => setOccupancy(val)}
              placeholder="Occupancy"
              value={occupancy} />
          </Item>
        </Form>
        <Button onPress={createUser} light>
          <Text>Create</Text>
        </Button>
      </Content>
    );
  }

  return (
    <Container>
      {
        openPrompt
        ? userForm()
        : null
      }
      {
        createdUser
        ? <Trips db={db} identity={identity}/>
        : null
      }
    </Container>
  );
}
