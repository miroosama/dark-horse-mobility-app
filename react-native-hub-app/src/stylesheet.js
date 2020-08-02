import { StyleSheet } from 'react-native'

const stylesheet = StyleSheet.create({
  content: {
    padding: 14,
  },
  container: {
    backgroundColor: '#303030',
    flex: 1,
    flexDirection: 'column', // main axis
    justifyContent: 'center', // main axis
    alignItems: 'center', // cross axis
  },
  adImg: {
    width: 200,
    height: 400,
  },
  text: {
    color: 'white'
  }
})

export default stylesheet;
