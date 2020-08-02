import { StyleSheet } from 'react-native'

const stylesheet = StyleSheet.create({
  content: {
    padding: 14
  },
  container: {
    flex: 1,
    flexDirection: 'column', // main axis
    justifyContent: 'center', // main axis
    alignItems: 'center', // cross axis
  },
  adImg: {
    width: 100,
    height: 200,
  },
})

export default stylesheet;
