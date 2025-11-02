import React from 'react';
import {StyleSheet, Text, View, Dimensions, Pressable} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';

import {
  HomeIcon,
  HomeOIcon,
  AppliedJobIcon,
  AppliedJobOIcon,
  LearningIcon,
  LearningOIcon,
  ProfileIcon,
  ProfileOIcon,
} from '../SVGIcon';

const {width} = Dimensions.get('window');

const JobMenu = () => {
  const navigation = useNavigation();
  const router = useRoute();
  const insets = useSafeAreaInsets(); // ✅ Handles bottom space on all devices

  const menuList = [
    {
      title: 'Home',
      link: 'JobPage',
      icon: HomeIcon,
      icon_active: HomeOIcon,
      subLink: ['ID', 'Visiting'],
    },
    {
      title: 'Applied Job',
      link: 'AppliedJob',
      icon: AppliedJobIcon,
      icon_active: AppliedJobOIcon,
      subLink: [''],
    },
    {
      title: 'Learning',
      link: 'Learning',
      icon: LearningIcon,
      icon_active: LearningOIcon,
      subLink: [''],
    },
    {
      title: 'Profile',
      link: 'JobProfile',
      icon: ProfileIcon,
      icon_active: ProfileOIcon,
      subLink: [''],
    },
  ];

  return (
    // <SafeAreaView edges={['bottom']} style={styles.safeArea}>
    <View style={[styles.maincontainer, {paddingBottom: insets.bottom}]}>
      <View style={styles.container}>
        {menuList.map((item, i) => {
          const isActive =
            item.subLink.includes(router.name) || router.name === item.link;
          const IconComponent = isActive ? item.icon_active : item.icon;
          return (
            <Pressable
              style={styles.menu}
              key={i}
              onPress={() => navigation.navigate(item.link)}>
              {IconComponent && (
                <IconComponent
                  color={isActive ? '#FF8D53' : '#585858'}
                  size={22}
                />
              )}
              <Text
                style={[
                  styles.text,
                  {color: isActive ? '#FF8D53' : '#585858'},
                ]}>
                {item.title}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>

    // </SafeAreaView>
  );
};

export default JobMenu;

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: '#fff',
  },
  maincontainer: {
    backgroundColor: '#ffffff',
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: width,
    // height: 70,
    paddingVertical: 10,

    backgroundColor: '#fff',
  },
  text: {
    fontSize: 12,
    fontWeight: '400',
    textAlign: 'center',
  },
  menu: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
