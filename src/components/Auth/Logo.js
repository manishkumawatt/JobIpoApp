/* eslint-disable prettier/prettier */
/* eslint-disable semi */
import {StyleSheet, Image, View} from 'react-native';
import React from 'react';

const Logo = () => {
  return (
    <View style={styles.logoContainer}>
      <Image 
      style={styles.logoImage}
      source={require('../../../assets/Jobipo_Logoo.png')} />
    </View>
  );
};

export default Logo;

const styles = StyleSheet.create({
  logoContainer: {
    // marginTop: 75,
    // backgroundColor:'#ffffff',
  },
  logoImage:{
    width:160,
    height: 100,
    resizeMode: 'contain',
  },
});
