/* eslint-disable prettier/prettier */
import React, {useState, useCallback} from 'react';
import {
  StyleSheet,
  Text,
  StatusBar,
  View,
  Image,
  Pressable,
  Dimensions,
} from 'react-native';
import {
  useNavigation,
  useRoute,
  useFocusEffect,
} from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {SettingsIcon, NotificationIcon, CircleBorderIcon} from './SVGIcon';
import {showToastMessage} from '../utils/Toast';

const {width} = Dimensions.get('window');

const TopHeaderAffiliateNew = () => {
  const navigation = useNavigation();
  const router = useRoute();
  const insets = useSafeAreaInsets();

  const [users, setUsers] = useState([]);
  const [isLoading, setisLoading] = useState(true);
  const [jobseekers, setJobseekers] = useState([]);

  useFocusEffect(
    useCallback(() => {
      const GetDataFunc = async () => {
        try {
          const res = await fetch('https://jobipo.com/api/Agent/index');
          const sliderDataApi = await res.json();

          if (sliderDataApi?.logout !== 1) {
            setisLoading(false);
            const parsedMsg = JSON.parse(sliderDataApi?.msg);
            setUsers(parsedMsg?.users);
            if (parsedMsg?.jobseeker) setJobseekers(parsedMsg.jobseeker);
          } else {
            // You can handle signOut() here if needed
          }
        } catch (err) {
          showToastMessage('Please check your internet connection.');
        }
      };

      let mount = true;
      if (mount) GetDataFunc();
      return () => {
        mount = false;
      };
    }, []),
  );

  const menuList = [
    {
      title: 'Job Home',
      img: require('../../assets/icons/menu/home.png'),
      img_active: require('../../assets/icons/menu/home_active.png'),
      link: 'JobPage',
      subLink: ['JobPage'],
    },
    {
      title: 'Affiliate',
      img: require('../../assets/icons/menu/home.png'),
      img_active: require('../../assets/icons/menu/home_active.png'),
      link: 'Home',
      subLink: ['ID', 'Visiting'],
    },
  ];

  return (
    <View style={[styles.wrapper, {paddingTop: insets.top}]}>
      {/* <StatusBar barStyle="light-content" backgroundColor="#FF8D53" /> */}

      {/* Menu Tabs */}
      <View style={styles.container}>
        {menuList.map((item, i) => {
          const isActive =
            item.subLink.includes(router.name) || router.name === item.link;

          const dynamicStyle = [
            styles.menu,
            isActive && styles.activeTab,
            item.link === 'JobPage' && isActive && {borderTopRightRadius: 20},
            item.link === 'Home' && isActive && {borderTopLeftRadius: 20},
          ];

          return (
            <Pressable
              key={i}
              style={dynamicStyle}
              onPress={() => navigation.navigate(item.link)}>
              <Text
                style={[
                  styles.text,
                  isActive ? styles.activeText : styles.inactiveText,
                ]}>
                {item.title}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {/* Profile Section */}
      <View style={styles.profileContainer}>
        {/* Profile Image */}
        <View style={{margin: 10}}>
          <CircleBorderIcon />
        </View>

        {/* Name & Job Title */}
        <View style={styles.profileText}>
          <Text style={styles.profileName}>{users['fullName']}</Text>
          <Text style={styles.profilePosition}>{jobseekers['jobTitle']}</Text>
        </View>

        {/* Icons */}
        <View style={styles.iconGroup}>
          <Pressable onPress={() => navigation.navigate('Settings')}>
            <SettingsIcon />
          </Pressable>
          <Pressable onPress={() => navigation.navigate('Notifications')}>
            <NotificationIcon />
          </Pressable>
        </View>
      </View>
    </View>
  );
};

export default TopHeaderAffiliateNew;

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: '#4EAED8',
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: width,
    backgroundColor: '#4EAED8',
  },
  menu: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    paddingVertical: 12,
  },
  text: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  activeTab: {
    backgroundColor: '#ffffff',
  },
  activeText: {
    color: '#000000',
  },
  inactiveText: {
    color: '#ffffff',
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    backgroundColor: '#fff',

    paddingVertical: 10,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  profileText: {
    flex: 1,
    marginLeft: 2,
  },
  profileName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000',
  },
  profilePosition: {
    fontSize: 10,
    color: '#777',
  },
  iconGroup: {
    flexDirection: 'row',
    gap: 10,
  },
  icon: {
    width: 22,
    height: 22,
    marginLeft: 12,
    tintColor: '#585858',
  },
});
