/* eslint-disable prettier/prettier */
import React, {useState, useCallback} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  StatusBar,
  Pressable,
  Dimensions,
} from 'react-native';
import {
  useNavigation,
  useRoute,
  useFocusEffect,
} from '@react-navigation/native';
import {SettingsIcon, NotificationIcon, CircleBorderIcon} from './SVGIcon';
import {
  HeartFilledWhiteIcon,
  HeartFilledOrangeIcon,
  HeartFilledOrangeIconNew,
} from '../screens/JobSvgIcons';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {showToastMessage} from '../utils/Toast';

const {width} = Dimensions.get('window');

const LearningHeader = () => {
  const navigation = useNavigation();
  const router = useRoute();
  const insets = useSafeAreaInsets();
  const [imageArr, setImageArr] = useState([]);
  const [isLoading, setisLoading] = useState(true);
  const [pdfArr, setPdfArr] = useState([]);
  const [videoArr, setVideoArr] = useState([]);
  const AUTH_TOKEN = 'a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6';

  useFocusEffect(
    useCallback(() => {
      const GetDataFunc = async () => {
        const sliderDataApi = await fetch(
          // 'https://jobipo.com/api/Agent/learning', --old api
          'https://jobipo.com/api/v3/get-learning',
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${AUTH_TOKEN}`,
            },
          },
        )
          .then(res => res.json())
          .catch(err => console.log(err));
        // console.log('sliderDataddApi-d-==-=-=-', sliderDataApi);

        if (sliderDataApi?.status == 'success') {
          const videoArrays = sliderDataApi?.data?.training.filter(
            item => item.type === 'video',
          );
          const pdfAndImageArrays = sliderDataApi?.data?.training.filter(
            item => item.type === 'pdf' || item.type === 'image',
          );
          setVideoArr(videoArrays);
          setPdfArr(pdfAndImageArrays);

          setisLoading(false);
        } else {
          showToastMessage('Please check your internet connection.');
        }
      };

      let mount = true;

      if (mount) {
        GetDataFunc();
      }

      return () => {
        mount = false;
      };
    }, []),
  );
  const menuList = [
    {
      title: 'Videos',
      icon_active: null,
      icon_inactive: null,
      img: require('../../assets/icons/menu/home.png'),
      img_active: require('../../assets/icons/menu/home_active.png'),
      link: 'Learning',
      subLink: [''],
    },
    {
      title: 'PDF & Other',
      icon_active: <HeartFilledOrangeIconNew />,
      icon_inactive: <HeartFilledWhiteIcon />,
      img: require('../../assets/icons/menu/home.png'),
      img_active: require('../../assets/icons/menu/home_active.png'),
      link: 'PdfComponent',
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
                  onPress={() =>
                    navigation.navigate(item.link, {
                      paramArr:
                        item.link === 'PdfComponent' ? pdfArr : videoArr,
                    })
                  }>
                  <View style={styles.iconWithText}>
                    <Text
                      style={[
                        styles.text,
                        isActive ? styles.activeText : styles.inactiveText,
                      ]}>
                      {item.title}
                    </Text>
                    <View style={{marginLeft: 6}}>
                      {isActive ? item.icon_active : item.icon_inactive}
                    </View>
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

export default LearningHeader;

const styles = StyleSheet.create({
  whiteWrapper: {
    backgroundColor: '#FF8D53',
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
