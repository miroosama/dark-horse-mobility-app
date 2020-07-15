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
  }
})

export default stylesheet;
