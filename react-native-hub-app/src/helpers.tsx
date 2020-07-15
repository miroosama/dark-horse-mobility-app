import AsyncStorage from '@react-native-community/async-storage';
import { ThreadID } from '@textile/hub'
import { Libp2pCryptoIdentity } from '@textile/threads-core'

const version = 10038 //Math.floor(Math.random() * 1000);
const IDENTITY_KEY = 'identity-' + version
const USER_THREAD_ID = 'user-thread-' + version

export const cacheUserThread = async (id: ThreadID) => {
  await AsyncStorage.setItem(USER_THREAD_ID, id.toString())
}

export const getCachedUserThread = async (): Promise<ThreadID | undefined> => {
  /**
   * All storage should be scoped to the identity
   *
   * If the identity changes and you try to use an old database,
   * it will error due to not authorized.
   */
  const idStr = await AsyncStorage.getItem(USER_THREAD_ID)
  // Every user adds their info to same user thread

  if (idStr) {
    /**
     * Temporary hack to get ThreadID working in RN
     */
    const id: ThreadID = ThreadID.fromString(idStr)
    return id
  }
  return undefined
}

export const generateIdentity = async (): Promise<Libp2pCryptoIdentity> => {
  let idStr = await AsyncStorage.getItem(IDENTITY_KEY)
  if (idStr) {
    const cachedId = await Libp2pCryptoIdentity.fromString(idStr)
    return [cachedId, true]
  } else {
    const id = await Libp2pCryptoIdentity.fromRandom()
    idStr = id.toString()
    await AsyncStorage.setItem(IDENTITY_KEY, idStr)
    return [id, false]
  }
}

export const userSchema = {
  $id: 'https://example.com/astronaut.schema.json',
  $schema: 'http://json-schema.org/draft-07/schema#',
  title: 'Users',
  type: 'object',
  required: ['_id'],
  properties: {
    _id: {
      type: 'string',
      description: "The instance's id.",
    },
    userAddress: {
      type: 'string',
      description: "User's Identity",
    },
    username: {
      type: 'string',
      description: "username",
    },
    socialHandle: {
      type: 'string',
      description: "Instagram Handle",
    },
    age: {
      description: 'Age',
      type: 'integer',
      minimum: 0,
    },
    occupancy: {
      type: 'string',
      description: "User's occupancy",
    },
  },
}
