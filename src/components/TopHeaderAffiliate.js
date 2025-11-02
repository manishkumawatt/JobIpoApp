/* eslint-disable prettier/prettier */
import React, {useState, useCallback} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  Dimensions,
  StatusBar,
  Image,
  TouchableOpacity,
} from 'react-native';
import {
  useNavigation,
  useRoute,
  useFocusEffect,
  DrawerActions,
} from '@react-navigation/native';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import {CircleBorderIcon, SettingsIconB, NotificationIconB} from './SVGIcon';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {showToastMessage} from '../utils/Toast';
import ImageLoadView from '../utils/imageLoadView';
import AsyncStorage from '@react-native-async-storage/async-storage';

const {width} = Dimensions.get('window');

const TopHeaderAffiliateNew = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const insets = useSafeAreaInsets();

  const [users, setUsers] = useState('');
  const [photo, setPhoto] = useState('');
  const [uData, setUData] = useState('');
  const [isLoading, setisLoading] = useState(true);
  const [jobseekers, setJobseekers] = useState([]);

  useFocusEffect(
    useCallback(() => {
      methodProfile();
      const GetDataFunc = async () => {
        try {
          const res = await fetch('https://jobipo.com/api/Agent/index');
          const data = await res.json();
          // console.log('data----', data);
          if (data?.logout !== 1) {
            setisLoading(false);
            const parsedMsg = JSON.parse(data?.msg);
            setUsers(parsedMsg?.users);
            setUData(parsedMsg.UData || {});
            if (parsedMsg?.jobseeker) setJobseekers(parsedMsg.jobseeker);
          }
        } catch (err) {
          // // console.log('❌ Fetch Error:', err);
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
  // console.log('uData----', uData);
  const methodProfile = async () => {
    try {
      const userID = await AsyncStorage.getItem('UserID');

      const response = await fetch(
        `https://jobipo.com/api/v3/view-profile?UserID=${userID}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6',
          },
        },
      );

      const data = await response.json();
      // console.log('data------1----rr-', data);

      setPhoto(data.data.photo || null);
    } catch (error) {
      // console.error('❌ Error fetching profile:', error);
    }
  };
  const menuList = [
    {
      title: 'Job Home',
      link: 'JobPage',
      subLink: ['JobPage'],
    },
    {
      title: 'Affiliate',
      link: 'Home',
      subLink: ['ID', 'Visiting'],
    },
  ];
  const isAffiliateScreen =
    route.name === 'Home' || menuList[1].subLink.includes(route.name);

  return (
    <View style={[styles.wrapper, {paddingTop: insets.top}]}>
      {/* Header Tabs */}
      <View style={styles.tabContainer}>
        {menuList.map((item, i) => {
          const isActive =
            item.link === route.name || item.subLink.includes(route.name);

          return (
            <View key={i} style={styles.tabWrapper}>
              <Pressable
                style={[
                  styles.menu,
                  isActive && styles.activeTab,
                  item.link === 'JobPage' &&
                    isActive && {borderTopRightRadius: 20},
                  item.link === 'Home' && isActive && {borderTopLeftRadius: 20},
                ]}
                onPress={() => navigation.navigate(item.link)}>
                <Text
                  style={[
                    styles.text,
                    isActive ? styles.activeText : styles.inactiveText,
                  ]}>
                  {item.title}
                </Text>
              </Pressable>

              {/* Show 3-dot icon only in Affiliate tab */}
              {item.link === 'Home' && isActive && (
                <Pressable
                  onPress={() =>
                    navigation.dispatch(DrawerActions.openDrawer())
                  }
                  style={styles.dotIcon}>
                  <Ionicons
                    name="ellipsis-vertical"
                    size={20}
                    color="#000000"
                  />
                </Pressable>
              )}
            </View>
          );
        })}
      </View>

      {/* Profile Section */}
      <View style={styles.profileContainer}>
        <View style={{margin: 10}}>
          {/* <CircleBorderIcon /> */}
          {photo ? (
            <Image
              resizeMode="cover"
              source={{uri: photo}}
              style={{height: 36, width: 36, borderRadius: 20}}
            />
          ) : (
            <CircleBorderIcon />
          )}
        </View>

        <View style={styles.profileText}>
          <Text style={styles.profileName}>{users?.fullName || 'User'}</Text>
          <Text style={styles.profilePosition}>
            Refer Code : {uData?.referCode || ''}
            {/* {jobseekers['preferred_job_Title']} */}
          </Text>
        </View>

        <View style={styles.iconGroup}>
          <Pressable onPress={() => navigation.navigate('Contactus')}>
            <SettingsIconB />
          </Pressable>
          <Pressable
            style={{top: 3, marginLeft: 10}}
            onPress={() => navigation.navigate('Notifications')}>
            <NotificationIconB />
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
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#4EAED8',
  },
  tabWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  menu: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  text: {
    fontSize: 20,
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
  dotIcon: {
    position: 'absolute',
    right: 10,
    top: '50%',
    transform: [{translateY: -10}],
    padding: 5,
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    backgroundColor: '#fff',
    paddingVertical: 10,
  },
  profileText: {
    flex: 1,
    marginLeft: 2,
  },
  profileName: {
    fontSize: 14,
    fontWeight: '700',
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
});
