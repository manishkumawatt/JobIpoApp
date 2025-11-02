import React, {useState, useCallback} from 'react';
import {
  StyleSheet,
  StatusBar,
  Text,
  View,
  Pressable,
  Dimensions,
  Image,
} from 'react-native';
import {
  useNavigation,
  useRoute,
  useFocusEffect,
} from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {SettingsIcon, CircleBorderIcon} from './SVGIcon';
import {showToastMessage} from '../utils/Toast';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ImageLoadView from '../utils/imageLoadView';
import AsyncStorage from '@react-native-async-storage/async-storage';
import imagePath from '../theme/imagePath';

const {width} = Dimensions.get('window');

const TopHeaderJob = ({handleReferPress}) => {
  const navigation = useNavigation();
  const route = useRoute();
  const insets = useSafeAreaInsets();
  const [photo, setPhoto] = useState('');
  const [users, setUsers] = useState([]);
  const [jobseekers, setJobseekers] = useState([]);

  useFocusEffect(
    useCallback(() => {
      const GetDataFunc = async () => {
        try {
          const res = await fetch('https://jobipo.com/api/Agent/index');
          const sliderDataApi = await res.json();
          if (sliderDataApi?.logout !== 1) {
            const parsedMsg = JSON.parse(sliderDataApi?.msg);
            console.log('parsedMsg?.users-=-==--=-=', parsedMsg?.users);
            setUsers(parsedMsg?.users);
            if (parsedMsg?.jobseeker) setJobseekers(parsedMsg.jobseeker);
          }
        } catch (err) {
          // // console.log('❌ Fetch Error:', err);
          showToastMessage('Please check your internet connection.');
        }
      };
      fetchProfile();
      GetDataFunc();
    }, []),
  );
  const fetchProfile = async () => {
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
      console.log('data------1-----', data);

      setPhoto(data?.data?.photo || null);

      try {
        const decoded = JSON.parse(JSON.parse(data.data.languageKnown));
        setLanguageKnown(Array.isArray(decoded) ? decoded : []);
      } catch (error) {}
    } catch (error) {
      // console.error('❌ Error fetching profile:', error);
    }
  };
  const menuList = [
    {title: 'Job Home', link: 'JobPage', subLink: ['JobPage']},
    {title: 'Affiliate', link: 'Home', subLink: ['ID', 'Visiting']},
  ];

  return (
    <View style={[styles.wrapper, {paddingTop: insets.top}]}>
      {/* <StatusBar barStyle="light-content" backgroundColor="#FF8D53" /> */}

      {/* Tab Menu */}
      <View style={styles.container}>
        {menuList.map((item, i) => {
          const isActive =
            item.subLink.includes(route.name) || route.name === item.link;

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
        <View style={{marginVertical: 6}}>
          {photo ? (
            <ImageLoadView
              resizeMode="cover"
              source={{uri: photo}}
              style={styles.profileImage}
            />
          ) : (
            <CircleBorderIcon />
          )}
        </View>

        <View style={styles.profileText}>
          <Text style={styles.profileName}>{users['fullName']}</Text>
          <Text style={styles.profilePosition}>
            {jobseekers['preferred_job_Title']}
          </Text>
        </View>
        {/* <Pressable style={{marginRight: 10}} onPress={handleReferPress}>
          <Image
            source={imagePath.bonus}
            style={{width: 20, height: 20, tintColor: '#FFA556'}}
            resizeMode="contain"
          />
        </Pressable> */}

        <View style={styles.iconGroup}>
          <Pressable onPress={() => navigation.navigate('JobipoSupport')}>
            <SettingsIcon />
          </Pressable>
        </View>
        <Pressable onPress={() => navigation.navigate('Notifications')}>
          <Ionicons
            name="notifications"
            style={{marginLeft: 10}}
            size={28}
            color="#FFA556"
          />
        </Pressable>
      </View>
    </View>
  );
};

export default TopHeaderJob;

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: '#FFA556',
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: width,
    backgroundColor: '#FFA556',
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
    backgroundColor: '#ffffff',
    paddingVertical: 10,
  },
  profileText: {
    flex: 1,
    marginLeft: 8,
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
    alignItems: 'center',
    gap: 10,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 40,
    backgroundColor: '#eee',
  },
});
