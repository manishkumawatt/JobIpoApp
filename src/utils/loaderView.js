import React from 'react';
import {View, StyleSheet, ActivityIndicator} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import Colors from '../theme/colors';

const LoaderView = props => {
  const loaderShow = useSelector(state => state.loading.show);
  return loaderShow ? (
    <View style={styles.container}>
      <ActivityIndicator
        size={'large'}
        color={Colors.secondary.ASTRONAUT_BLUE}
      />
    </View>
  ) : (
    <View />
  );
};

export default LoaderView;

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    position: 'absolute',
    height: '100%',
    width: '100%',
    backgroundColor: 'rgba(0,0,0,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 5,
  },
});
