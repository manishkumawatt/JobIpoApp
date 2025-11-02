/* eslint-disable prettier/prettier */
import {StyleSheet, Text, View, Pressable} from 'react-native';
import React from 'react';
import Entypo from 'react-native-vector-icons/Entypo';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';

const Header = ({title, textColor}) => {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <Pressable style={styles.headerFlex}>
        <Pressable onPress={() => navigation.navigate('Menupage')}>
          <Entypo
            name="dots-three-vertical"
            style={{marginRight: 12}}
            size={25}
            color="#0d4574"
          />
        </Pressable>

        <Text style={styles.heading}>Jobipo</Text>
      </Pressable>
      <View style={styles.headerFlex}>
        {/* <Pressable onPress={() => navigation.navigate('Profile') } >
          <Entypo name="user" size={23} color="#0d4574" />          
        </Pressable>   */}
        <Pressable onPress={() => navigation.navigate('Notifications')}>
          <Ionicons
            name="notifications"
            style={{marginLeft: 10}}
            size={28}
            color="#FF8D53"
          />
        </Pressable>
      </View>
    </View>
  );
};

const Header2 = ({title, textColor}) => {
  const navigation = useNavigation();
  return (
    <View style={styles2.container}>
      <View style={styles.headerFlex}>
        {/* <Pressable onPress={() => navigation.navigate('Home') }> */}
        <Pressable onPress={() => navigation.goBack()}>
          <Entypo name="chevron-thin-left" color="#535353" size={30} />
        </Pressable>
        <Text style={[styles2.heading, {color: textColor || '#FF8D53'}]}>
          {title}
        </Text>
      </View>
      {/* <View style={styles.headerFlex}> 
    
        <Pressable  onPress={() => navigation.navigate('Notifications') } >
          <Ionicons
            name="notifications"
            style={{ marginLeft: 10 }}
            size={28}
            color="#FF8D53"
          /> 
        </Pressable>
      </View> */}
    </View>
  );
};

export default Header;
export {Header2};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 69,
    paddingRight: 14,
    paddingLeft: 21,
    backgroundColor: '#ffffff',
  },
  blackText: {
    color: '#000',
    marginHorizontal: 10,
  },
  headerFlex: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  heading: {
    color: '#FF8D53',
    fontSize: 20,
    fontWeight: '600',
  },
});

const styles2 = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 69,
    paddingLeft: 10,
    paddingRight: 14,
    justifyContent: 'space-between',
    backgroundColor: '#ffffff',
  },
  heading: {
    color: '#FF8D53',
    fontSize: 20,
    fontWeight: '600',
    marginLeft: 19,
  },
  headerFlex: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
