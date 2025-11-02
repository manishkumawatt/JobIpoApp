/* eslint-disable prettier/prettier */
import {
  StyleSheet,
  Text,
  Image,
  View,
  FlatList,
  Pressable,
  ScrollView,
  Alert,
} from 'react-native';
import React, {useState, useEffect, useRef, useCallback} from 'react';
import Menu from '../components/Menu';
import Header from '../components/Header';
import Logout from '../components/Logout';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const Menupage = ({navigation}) => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const GetDataFunc = async () => {
      const sliderDataApi = await fetch('https://jobipo.com/api/Agent/index', {
        method: 'GET',
      })
        .then(res => res.json())
        .catch(err => console.log(err));

      if (sliderDataApi) {
        if (sliderDataApi.logout != 1) {
          setUsers(
            JSON.parse(JSON.parse(JSON.stringify(sliderDataApi)).msg).users,
          );
          // // console.log(users);
        } else {
          navigation.navigate('Login');
        }
      } else {
        Alert.alert(
          'Connection Issue',
          'Please check your internet connection.',
        );
      }
    };

    GetDataFunc();
  }, []);

  return (
    <>
      <Header />
      <ScrollView style={styles.container}>
        <View style={styles.MainContainer}>
          <View
            style={[
              styles.product,
              styles.BackgroundWhite,
              styles.marginTop10,
            ]}>
            <View style={styles.productDescBox}>
              <Text style={styles.Datactitle}>Hi, {users['fullName']}</Text>
            </View>
          </View>
          <View style={[styles.product, styles.BackgroundWhite]}>
            <View style={styles.productDescBox}>
              <Pressable onPress={() => navigation.navigate('Profile')}>
                <Text style={styles.Datatitle}>My Profile</Text>
              </Pressable>
            </View>
          </View>
          <View style={[styles.product, styles.BackgroundWhite]}>
            <View style={styles.productDescBox}>
              <Pressable onPress={() => navigation.navigate('Myearning')}>
                <Text style={styles.Datatitle}>My Earning</Text>
              </Pressable>
            </View>
          </View>

          <View style={[styles.product, styles.BackgroundWhite]}>
            <View style={styles.productDescBox}>
              <Pressable onPress={() => navigation.navigate('Myteam')}>
                <Text style={styles.Datatitle}>My Team</Text>
              </Pressable>
            </View>
          </View>
          <View style={[styles.product, styles.BackgroundWhite]}>
            <View style={styles.productDescBox}>
              <Pressable onPress={() => navigation.navigate('Wallet')}>
                <Text style={styles.Datatitle}>Wallet</Text>
              </Pressable>
            </View>
          </View>
          <View style={[styles.product, styles.BackgroundWhite]}>
            <View style={styles.productDescBox}>
              <Pressable onPress={() => navigation.navigate('FullReport')}>
                <Text style={styles.Datatitle}>FullReport</Text>
              </Pressable>
            </View>
          </View>
          <View style={[styles.product, styles.BackgroundWhite]}>
            <View style={styles.productDescBox}>
              <Pressable onPress={() => navigation.navigate('LeadOnline')}>
                <Text style={styles.Datatitle}>Lead</Text>
              </Pressable>
            </View>
          </View>
          <View style={[styles.product, styles.BackgroundWhite]}>
            <View style={styles.productDescBox}>
              <Pressable onPress={() => navigation.navigate('Kyc')}>
                <Text style={styles.Datatitle}>Kyc</Text>
              </Pressable>
            </View>
          </View>

          <View style={[styles.product, styles.BackgroundWhite]}>
            <View style={styles.productDescBox}>
              <Pressable onPress={() => navigation.navigate('TDSDetails')}>
                <Text style={styles.Datatitle}>TDSDetails</Text>
              </Pressable>
            </View>
          </View>

          <View style={[styles.product, styles.BackgroundWhite]}>
            <View style={styles.productDescBox}>
              <Pressable onPress={() => navigation.navigate('Paymentsetting')}>
                <Text style={styles.Datatitle}>Payment Setting</Text>
              </Pressable>
            </View>
          </View>
          <View style={[styles.product, styles.BackgroundWhite]}>
            <View style={styles.productDescBox}>
              <Pressable onPress={() => navigation.navigate('Changepassword')}>
                <Text style={styles.Datatitle}>Change Password</Text>
              </Pressable>
            </View>
          </View>
          <View style={[styles.product, styles.BackgroundWhite]}>
            <View style={styles.productDescBox}>
              <Pressable onPress={() => navigation.navigate('Trainings')}>
                <Text style={styles.Datatitle}>Trainings</Text>
              </Pressable>
            </View>
          </View>
          <View style={[styles.product, styles.BackgroundWhite]}>
            <View style={styles.productDescBox}>
              <Pressable onPress={() => navigation.navigate('Visiting')}>
                <Text style={styles.Datatitle}>Visiting Card</Text>
              </Pressable>
            </View>
          </View>
          <View style={[styles.product, styles.BackgroundWhite]}>
            <View style={styles.productDescBox}>
              <Pressable onPress={() => navigation.navigate('ID')}>
                <Text style={styles.Datatitle}>ID Card</Text>
              </Pressable>
            </View>
          </View>
          <View style={[styles.product, styles.BackgroundWhite]}>
            <View style={styles.productDescBox}>
              <Pressable onPress={() => navigation.navigate('Contactus')}>
                <Text style={styles.Datatitle}>Contact Us</Text>
              </Pressable>
            </View>
          </View>
          <View style={[styles.product, styles.BackgroundWhite]}>
            <View style={styles.productDescBox}>
              <Pressable onPress={() => navigation.navigate('About')}>
                <Text style={styles.Datatitle}>About Us</Text>
              </Pressable>
            </View>
          </View>
          <View style={[styles.product, styles.BackgroundWhite]}>
            <View style={styles.productDescBox}>
              <Pressable onPress={() => navigation.navigate('Privacy')}>
                <Text style={styles.Datatitle}>Privacy and Policy</Text>
              </Pressable>
            </View>
          </View>
          <View style={[styles.product, styles.BackgroundWhite]}>
            <View style={styles.productDescBox}>
              <Logout navigation={navigation}></Logout>
            </View>
          </View>
        </View>
      </ScrollView>
      <Menu />
    </>
  );
};

export default Menupage;

const styles = StyleSheet.create({
  container: {
    marginTop: 0,
    marginLeft: 0,
    paddingVertical: 0,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    flex: 1,
    width: '70%',
    marginBottom: 50,
  },
  product: {
    alignItems: 'center',
    textAlignVertical: 'top',
    paddingTop: 0,
    paddingBottom: 5,
    paddingHorizontal: 4,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  image: {
    width: '100%',
    backgroundColor: '#edfaff',
    alignItems: 'center',
  },
  title: {
    color: '#fff',
    paddingTop: 0,
    fontSize: 16,
  },
  Datatitle: {
    color: '#000',
    paddingTop: 20,
    fontSize: 16,
  },
  Datactitle: {
    paddingTop: 0,
    fontSize: 20,
    color: '#000',
  },
  Datadesc: {
    paddingTop: 0,
    fontSize: 13,
  },
  productNo: {
    color: '#595959',
    marginVertical: 10,
    fontSize: 12,
  },
  productDescBox: {
    paddingVertical: 0,
    borderRadius: 0,
    flex: 1,
    paddingLeft: 5,
    paddingBottom: 5,
    textAlignVertical: 'top',
    justifyContent: 'flex-start',
  },
  bigWith: {
    paddingVertical: 0,
    borderRadius: 0,
    flex: 2,
    paddingLeft: 5,
    paddingBottom: 5,
  },
  productDesc: {
    textAlign: 'center',
    color: '#595959',
    fontSize: 12,
    textAlignVertical: 'top',
  },
  cardIcon: {
    fontSize: 25,
  },
  cardText: {
    fontSize: 15,
    color: '#0d4574',
  },
  card: {
    marginTop: 15,
  },
  customBox: {
    marginLeft: '2.5%',
    backgroundColor: '#FFC895',
    width: '95%',
    alignItems: 'center',
    height: 200,
    paddingVertical: 85,
  },
  SliderImage: {
    marginLeft: '2.5%',
    width: '95%',
    alignItems: 'center',
  },
  BackgroundBlue: {
    backgroundColor: '#0d4574',
  },
  BackgroundYellow: {
    backgroundColor: '#FFC895',
  },
  BackgroundWhite: {
    backgroundColor: '#fff',
  },
  MainContainer: {
    marginLeft: '2.5%',
    width: '95%',
    alignItems: 'center',
  },
  marginTop10: {
    marginTop: 10,
  },
});
