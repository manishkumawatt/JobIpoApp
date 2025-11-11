/* eslint-disable prettier/prettier */
import {
  StyleSheet,
  Text,
  Image,
  View,
  FlatList,
  Pressable,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
// import React from 'react';
import Menu from '../components/Menu';
import {Header2 as Header} from '../components/Header';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Video from 'react-native-video';
import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useContext,
} from 'react';
import Logo from '../components/Auth/Logo';
import {useFocusEffect} from '@react-navigation/native';
import {AuthContext} from '../context/context';

const Myteam = ({navigation}) => {
  const {signOut} = useContext(AuthContext);
  const [isLoading, setisLoading] = useState(true);
  const [brandsData, setBrandsData] = useState([]);
  const [totalEarning, setTotalEarning] = useState([]);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;
      const GetDataFunc = async () => {
        setisLoading(true);
        const sliderDataApi = await fetch(
          'https://jobipo.com/api/Agent/myNetwork',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
          },
        )
          .then(res => res.json())
          .catch(err => console.log(err));

        setisLoading(false);
        if (sliderDataApi && sliderDataApi.logout != 1) {
          setBrandsData(
            JSON.parse(JSON.parse(JSON.stringify(sliderDataApi)).msg).myNetwork,
          );
          setTotalEarning(
            JSON.parse(JSON.parse(JSON.stringify(sliderDataApi)).msg).data,
          );
        } else {
          signOut();
        }
      };

      if (isActive) {
        GetDataFunc();
      }

      return () => {
        isActive = false;
      };
    }, []),
  );

  return (
    <>
      <View
        style={[
          isLoading == true
            ? {
                position: 'absolute',
                height: '100%',
                width: '100%',
                backgroundColor: 'rgba(0,0,0,0.4)',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 5,
              }
            : {
                display: 'none',
              },
        ]}>
        {/* <Logo /> */}
        <ActivityIndicator size="large" />
      </View>
      {/* <Header title= 'My Team' /> */}
      <ScrollView style={styles.container}>
        {/* <View style={styles.vcustomBox}>
          <Video
            controls
            resizeMode="contain"
            source={{ uri: 'https://jobipo.com/assets/MOD Network Motion Graphics.m4v' }}
            style={{ flex: 1, width: '100%', height: 250, padding: 0, margin: 0, }}
          />
        </View> */}

        {/* <Image
          source={require('../../assets/Image/angelonebaner.png')}
          resizeMode="contain"
          style={[styles.SliderImage]}
        /> */}

        <View style={styles.MainContainer}>
          <View style={[styles.product, styles.BackgroundBlue]}>
            <View style={[styles.bigWith]}>
              <Text style={styles.title}>Your Friends bbbbb</Text>
            </View>
            <View style={styles.productDescBox}>
              <Text style={styles.title}>Friends Earning</Text>
            </View>
            <View style={styles.productDescBox}>
              <Text style={styles.title}>Your Earning</Text>
            </View>
          </View>
          <View style={[styles.product, styles.BackgroundYellow]}>
            <View style={[styles.bigWith]}>
              <Text style={styles.title}>
                {totalEarning.count} in your team
              </Text>
            </View>
            <View style={styles.productDescBox}>
              <Text style={styles.title}>
                ₹ {totalEarning.totalEarning ? totalEarning.totalEarning : 0}
              </Text>
            </View>
            <View style={styles.productDescBox}>
              <Text style={styles.title}>
                ₹{' '}
                {totalEarning.totalEarning ? totalEarning.totalEarning / 10 : 0}
              </Text>
            </View>
          </View>

          <FlatList
            data={brandsData}
            style={[styles.pmaincontrainer]}
            keyExtractor={item => item.userID} //has to be unique
            renderItem={({item}) => (
              <View
                style={[
                  styles.product,
                  styles.BackgroundWhite,
                  styles.marginTop10,
                ]}>
                <View style={[styles.bigWith]}>
                  <Text style={styles.Datatitle}>{item.fullName}</Text>
                  <Text style={styles.Datadesc}>
                    Contact : {item.contactNumber1}
                  </Text>
                  <Text style={styles.Datadesc}>
                    Refer Code : {item.uniqueCode}
                  </Text>
                </View>
                <View style={styles.productDescBox}>
                  <Text style={styles.Datatitle}>
                    ₹ {item.AmountEarn ? item.AmountEarn : 0}
                  </Text>
                </View>
                <View style={styles.productDescBox}>
                  <Text style={styles.Datatitle}>
                    ₹ {item.AmountEarn ? item.AmountEarn / 10 : 0}
                  </Text>
                </View>
              </View>
            )}
            horizontal={false}
            numColumns={1}
          />
        </View>
      </ScrollView>
      <Menu />
    </>
  );
};

export default Myteam;

const styles = StyleSheet.create({
  container: {
    paddingVertical: 14,
    paddingHorizontal: 10,
    backgroundColor: '#f8f8f8',
    flex: 1,
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
    width: '100%',
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
    paddingTop: 0,
    fontSize: 16,
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
    alignItems: 'center',
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
  pmaincontrainer: {
    width: '100%',
    marginBottom: 50,
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
    width: '95%',
    alignItems: 'center',
    height: 175,
    //        backgroundColor: '#ff0',
  },
  vcustomBox: {
    marginLeft: 0,
    width: '100%',
    padding: 0,
    alignItems: 'center',
    height: 200,
    borderRadius: 20,
    // backgroundColor: '#ff0',
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
    marginBottom: 30,
  },
  marginTop10: {
    marginTop: 10,
  },
});
