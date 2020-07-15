import React, { useState, useEffect } from 'react';
import { FlatList, TouchableOpacity, Linking, StyleSheet } from 'react-native';
import { Container, Text, Content, Form, Item, Input } from 'native-base';
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
} from './helpers';
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

  const createIdentityAndDb = async () => {
    try {
      const idArr = await generateIdentity();
      const id = idArr[0];
      console.log(id)
      const identity = id.toString();
      console.log(identity)
      const info = {
        key: USER_API_KEY,
        secret: USER_API_SECRET
      };
      let userDb = new Client();
      userDb = await Client.withKeyInfo(info);

      await userDb.getToken(id);
      console.log(idArr[1])
      if (idArr[1]) {
        setDb(userDb)
        setIdentity(identity);
        setCreatedUser(true);
      } else {
        const cachedThreadId = ThreadID.fromString(USER_THREAD_ID);
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
        id: '',
        userAddress: identity,
        username,
        socialHandle,
        age: parseInt(age),
        occupancy,
      }]);
      if (ids.length) setCreatedUser(true);
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
          <TouchableOpacity onPress={createUser}>
            <Text>Create</Text>
          </TouchableOpacity>
        </Form>
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
        ? <Trips db={db}/>
        : null
      }
    </Container>
  );
}
