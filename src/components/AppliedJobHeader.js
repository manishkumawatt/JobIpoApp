/* eslint-disable prettier/prettier */
import React, {useState, useCallback} from 'react';
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  Pressable,
  Dimensions,
} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import {useFocusEffect} from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {
  HeartIcon,
  HeartFilledWhiteIcon,
  HeartFilledOrangeIcon,
  HeartFilledOrangeIconNew,
} from '../screens/JobSvgIcons';
import {showToastMessage} from '../utils/Toast';

const {width} = Dimensions.get('window');

const AppliedJobHeader = () => {
  const navigation = useNavigation();
  const router = useRoute();
  const insets = useSafeAreaInsets(); // 👈

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
            if (parsedMsg?.jobseeker) {
              setJobseekers(parsedMsg.jobseeker);
            }
          } else {
            signOut();
          }
        } catch (err) {
          // // console.log('❌ Fetch or Parse Error:', err);
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
      title: 'Applied Jobs',
      icon_active: null,
      icon_inactive: null,
      link: 'AppliedJob',
      subLink: [''],
    },
    {
      title: 'Favorite Jobs',
      icon_active: <HeartFilledOrangeIconNew />,
      icon_inactive: <HeartFilledWhiteIcon />,
      link: 'FavJobs',
      subLink: [''],
    },
  ];

  return (
    <>
      {/* <StatusBar barStyle="light-content" backgroundColor="#FF8D53" /> */}
      <View style={[styles.whiteWrapper, {paddingTop: insets.top}]}>
        <View style={styles.whiteWrapperNew}>
          <View style={styles.container}>
            {menuList.map((item, i) => {
              const isActive =
                item.subLink.includes(router.name) || router.name === item.link;

              const dynamicStyle = [
                styles.menu,
                isActive && styles.activeTab,
                item.link === 'JobPage' &&
                  isActive && {borderTopRightRadius: 20},
                item.link === 'Home' && isActive && {borderTopLeftRadius: 20},
              ];

              return (
                <Pressable
                  key={i}
                  style={dynamicStyle}
                  onPress={() => navigation.navigate(item.link)}>
                  <View style={styles.iconWithText}>
                    <Text
                      style={[
                        styles.text,
                        isActive ? styles.activeText : styles.inactiveText,
                      ]}>
                      {item.title}
                    </Text>

                    {/* <View style={{marginLeft: 6}}>
                      {isActive ? item.icon_active : item.icon_inactive}
                    </View> */}
                  </View>
                </Pressable>
              );
            })}
          </View>
        </View>
      </View>
    </>
  );
};

export default AppliedJobHeader;

const styles = StyleSheet.create({
  whiteWrapper: {
    backgroundColor: '#FFA556',
    overflow: 'hidden',
  },
  whiteWrapperNew: {
    backgroundColor: '#ffffffff',
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: width,
    backgroundColor: '#FFA556',
    // marginTop: 8,
  },
  menu: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    paddingVertical: 16,
  },
  text: {
    fontSize: 20,
    fontWeight: '600',
  },
  activeTab: {
    backgroundColor: '#F5F4FD',
  },
  activeText: {
    color: '#000000',
  },
  inactiveText: {
    color: '#ffffff',
  },
  iconWithText: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
