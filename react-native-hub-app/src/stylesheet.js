import { StyleSheet } from 'react-native'

const stylesheet = StyleSheet.create({
  content: {
    padding: 14,
  },
  container: {
    backgroundColor: '#303030',
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  login: {
    backgroundColor: '#303030',
  },
  adImg: {
    width: 250,
    height: 500,
  },
  text: {
    color: 'white'
  },
  submitBtn: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40
  }
})

export default stylesheet;
