/* eslint-disable prettier/prettier */
import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  Pressable,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import SvgIcons from './SVGIcon';
import imagePath from '../theme/imagePath';

const {width} = Dimensions.get('window');

const Menu = () => {
  const navigation = useNavigation();
  const router = useRoute();
  console.log('router----', router);
  const menuList = [
    {
      title: 'Home',
      img: imagePath.home,
      img_active: require('../../assets/icons/menu/home_active.png'),
      link: 'Home',
      subLink: ['ID', 'Visiting'],
    },
    {
      title: 'Categories',
      img: imagePath.categorie,
      img_active: require('../../assets/icons/menu/prod_active.png'),
      link: 'Products',
      subLink: [''],
    },
    {
      title: 'Leads',
      img: imagePath.lead,
      img_active: require('../../assets/icons/menu/leads_active.png'),
      link: 'Leads',
      subLink: ['LeadOnline'],
    },
    {
      title: 'Team',
      img: imagePath.team,
      img_active: require('../../assets/icons/menu/team_active.png'),
      link: 'Myteam',
      subLink: [''],
    },
  ];

  return (
    <SafeAreaView edges={['bottom']} style={styles.safeArea}>
      <View style={styles.container}>
        {menuList.map((item, i) => {
          return (
            <Pressable
              style={styles.menu}
              key={i}
              onPress={() => navigation.navigate(item.link)}>
              <Image
                source={item.img}
                style={{
                  width: 17,
                  height: 17,
                  resizeMode: 'contain',
                  tintColor:
                    (router.name || router?.name == 'Contactus') === item.link
                      ? '#4EAED8'
                      : '#636363',
                }}
              />
              <Text
                style={{
                  fontSize: 12,
                  color: router.name === item.link ? '#4EAED8' : '#636363',
                  textAlign: 'center',
                }}>
                {item.title}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </SafeAreaView>
  );
};

export default Menu;

const styles = StyleSheet.create({
  // container: {
  //   position: 'absolute',
  //   bottom: 0,
  //   flexDirection: 'row',
  //   justifyContent: 'space-between',
  //   width: '100%',
  //   alignItems: 'center',
  //   height: 120,
  //   backgroundColor: '#fff',
  //   paddingHorizontal: 30,
  //   paddingBottom:30,
  // },
  safeArea: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: '#fff',
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: width,
    height: 70,
    backgroundColor: '#fff',
  },
  text: {
    fontSize: 12,
    color: '#636363',
    textAlign: 'center',
  },
  menu: {
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
});
