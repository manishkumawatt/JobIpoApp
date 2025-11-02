/* eslint-disable prettier/prettier */
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  Pressable,
  Image,
} from 'react-native';
import React from 'react';
import Entypo from 'react-native-vector-icons/Entypo';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';
import Logo from '../Auth/Logo';

const JobHeader = ({title}) => {
  const navigation = useNavigation();
  return (
    <>
      {/* <StatusBar backgroundColor="red" barStyle="light-content" /> */}
      <View style={styles.container}>
        <View style={styles.headerFlex}>
          <Pressable onPress={() => navigation.navigate('JobPage')}>
            <View style={styles.logoContainer}>
              <Image
                style={styles.logoImage}
                source={require('../../../assets/logo.jpg')}
              />
            </View>
            {/* <Logo/> */}
            {/* <Image
            source={require('../../../assets/rect_logo.png')}
            style={{ height: 40, aspectRatio: 16/9, borderRadius: 50 }}
            alt='logo'
          /> */}
            {/* <Ionicons
            name="location-outline"
            style={{ marginRight: 12 }}
            size={25}
            color="#0d4574"
          /> */}
          </Pressable>
        </View>
        <View style={styles.headerFlex}>
          {/* <Pressable onPress={() => navigation.navigate('Profile')} >
          <Entypo name="user" size={23} color="#0d4574" />
        </Pressable> */}

          {/* <Pressable onPress={() => navigation.navigate('FavJob')} >
          <Ionicons
            name="heart-outline"
            style={{ marginLeft: 10 }}
            size={28}
            color="#0d4574"
          />
        </Pressable> */}
          <Pressable onPress={() => navigation.navigate('Notifications')}>
            <Ionicons
              name="notifications"
              style={{marginLeft: 10}}
              size={28}
              color="#212529"
            />
          </Pressable>
        </View>
      </View>
    </>
  );
};

export default JobHeader;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 70,
    paddingRight: 14,
    backgroundColor: '#ffffff',
    // elevation: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    zIndex: 1,
  },
  //  logoContainer: {
  //   marginTop: 75,
  // },
  logoImage: {
    width: 150,
    height: 50,
  },
  blackText: {
    color: '#000',
    marginHorizontal: 10,
  },
  headerFlex: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  heading: {
    color: '#595959',
    fontSize: 22,
  },
});
