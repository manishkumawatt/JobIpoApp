import {Dimensions, StyleSheet} from 'react-native';
const {width, height} = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  imgStyle: {
    height: '100%',
    width: '100%',
  },
  imgView: {
    justifyContent: 'center',
    marginHorizontal: 20,
  },
  loading_view: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    height: '100%',
    width: '100%',
    justifyContent: 'center',
    alignSelf: 'center',
    alignItems: 'center',
  },
  list_view: {
    height: Dimensions.get('window').height - 150,
    width: Dimensions.get('window').width - 40,
    marginBottom: 100,
    alignSelf: 'center',
    marginTop: 10,
  },
  paging_view: {
    height: 10,
    width: 10,
    marginHorizontal: 5,
  },
  paging_1: {
    height: 10,
    width: 10,
    marginHorizontal: 5,
  },
  viewer_view: {
    height: Dimensions.get('window').height - 200,
    width: Dimensions.get('window').width - 40,
  },
  page_view: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 15,
    left: 0,
    right: 0,
  },
});
export default styles;
