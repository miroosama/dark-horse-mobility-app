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
    resizeMode:'contain',
    width: '100%',
    height: '65%',
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
  },
  adContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '65%'
  },
  rwdContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  }
})

export default stylesheet;
