/* eslint-disable prettier/prettier */
/* eslint-disable react/self-closing-comp */
/* eslint-disable prettier/prettier */
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  FlatList,
  Pressable,
  Share,
  Linking,
  Alert,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import React, {useState, useEffect, useRef, useCallback} from 'react';
//import React from 'react';
import Header from '../components/Header';
import Slider from '../components/Slider';
import Menu from '../components/Menu';
import Logo from '../components/Auth/Logo';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';

import {withOrientation} from 'react-navigation';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {SliderBox} from 'react-native-image-slider-box';

let userToken;
userToken = null;
const Home = ({navigation}) => {
  const [NewProduct, setNewProduct] = useState([]);
  const [TopProductData, setTopProductData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [uData, setUData] = useState([]);
  const [users, setUsers] = useState([]);
  const [leader, setLeader] = useState([]);
  const [slider, setSlider] = useState([]);
  const [isLoading, setisLoading] = useState(true);

  useEffect(() => {
    setTimeout(async () => {
      try {
        userToken = await AsyncStorage.getItem('userToken');
      } catch (e) {
        // // console.log(e);
      }
      // // console.log(userToken);
      if (userToken == null) {
        navigation.navigate('Login');
      }
      //dispatch({ type: 'RETRIEVE_TOKEN', token: userToken });
    }, 1);
  }, []);

  useEffect(() => {
    const GetDataFunc = async () => {
      // loginState.isLoading = true;
      const sliderDataApi = await fetch('https://jobipo.com/api/Agent/index', {
        method: 'GET',
      })
        .then(res => res.json())
        .catch(err => console.log(err));

      if (sliderDataApi) {
        if (sliderDataApi.logout != 1) {
          setNewProduct(
            JSON.parse(JSON.parse(JSON.stringify(sliderDataApi)).msg)
              .NewProduct,
          );

          setTopProductData(
            JSON.parse(JSON.parse(JSON.stringify(sliderDataApi)).msg)
              .TopProduct,
          );

          setCategoryData(
            JSON.parse(JSON.parse(JSON.stringify(sliderDataApi)).msg).category,
          );

          setUData(
            JSON.parse(JSON.parse(JSON.stringify(sliderDataApi)).msg).UData,
          );

          setUsers(
            JSON.parse(JSON.parse(JSON.stringify(sliderDataApi)).msg).users,
          );

          setLeader(
            JSON.parse(JSON.parse(JSON.stringify(sliderDataApi)).msg).leader,
          );
          setSlider(
            JSON.parse(JSON.parse(JSON.stringify(sliderDataApi)).msg).slider,
          );

          setisLoading(false);
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

  const onShare = async () => {
    try {
      const result = await Share.share({
        message:
          'Join Jobipo Now.  Click On Link.                                                                                           Refer Code: ' +
          users['uniqueCode'] +
          '                              https://www.jobipo.com/ ',
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
        } else {
        }
      } else if (result.action === Share.dismissedAction) {
      }
    } catch (error) {
      alert(error.message);
    }
  };
  //  // console.log(CategoryData);

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

      {/* <Header /> */}
      <ScrollView style={styles.container}>
        <View style={styles.profile}>
          <View style={styles.profContainer}>
            <Image
              source={{uri: 'data:image/png;base64,' + users['Pic']}}
              style={styles.profimage}
              resizeMode="contain"
            />
          </View>
          <View>
            <Text style={styles.h1}>Hi {users['fullName']}</Text>
            <Text style={styles.h2}>
              Your Refer Code: {users['uniqueCode']}
            </Text>
          </View>
        </View>

        <View style={styles.cardContainer}>
          <Pressable onPress={() => onShare()} style={styles.card}>
            <View style={styles.cardIcon}>
              <FontAwesome name="users" size={25} color="#0d4574" />
            </View>
            <Text style={styles.cardText}>Refer and Earn</Text>
          </Pressable>

          <Pressable
            onPress={() => {
              Linking.openURL(`https://www.jobipo.com/`);
            }}
            style={styles.card}>
            <View style={styles.cardIcon}>
              <Feather name="globe" size={25} color="#0d4574" />
            </View>
            <Text style={styles.cardText}>Visit Our Website </Text>
          </Pressable>
        </View>

        <View style={styles.annContainer}>
          {/* <Text style={styles.annText}>Announcements</Text> */}
          <View style={styles.annSlider}>
            {/* Slider Start */}
            <Slider title={slider} />
          </View>
        </View>

        <View style={styles.boxContainer}>
          <View style={styles.flexBoxes}>
            <View style={styles.box}>
              <View style={styles.currencyIcon}>
                <FontAwesome name="rupee" size={25} color="#0d4574" />
              </View>
              <View style={styles.currencyText}>
                <Text style={styles.currencyType}>Paid Earning</Text>
                <Text style={styles.currencyAmount}>
                  <FontAwesome name="rupee" size={15} color="#fff" />{' '}
                  {parseFloat(uData.PaidEarning) + parseFloat(uData.PaidBonus)}
                </Text>
              </View>
            </View>

            <View style={styles.box}>
              <View style={styles.currencyIcon}>
                <FontAwesome name="rupee" size={25} color="#0d4574" />
              </View>
              <View style={styles.currencyText}>
                <Text style={[styles.currencyType, styles.textone]}>
                  Pending Earning
                </Text>
                <Text style={styles.currencyAmount}>
                  <FontAwesome name="rupee" size={15} color="#fff" />{' '}
                  {parseFloat(uData.PendingEarning) +
                    parseFloat(uData.UnPaidBonus)}
                </Text>
              </View>
            </View>
          </View>
          {/* 2nd boxes */}
          <View style={styles.flexBoxes}>
            <View style={styles.box}>
              <Pressable
                style={styles.infoIcon}
                onPress={() => {
                  Alert.alert(
                    'Signup Bonus',
                    'Signup bonus will be approved after successful sale of minimum Rs 100 within 60 days. Otherwise Your Bonus Validity Expired.',
                  );
                }}>
                <Image
                  style={styles.infoImage}
                  source={require('../../assets/icons/infoIcon.png')}
                />
              </Pressable>
              <View style={styles.currencyIcon}>
                <FontAwesome name="rupee" size={25} color="#0d4574" />
              </View>
              <View style={styles.currencyText}>
                <Text style={styles.currencyType}>Sign Up Bonus</Text>
                <Text style={styles.currencyAmount}>
                  <FontAwesome name="rupee" size={15} color="#fff" />{' '}
                  {uData.SIGNUPBONUS}
                </Text>
              </View>
            </View>

            <View style={styles.box}>
              <Pressable
                style={styles.infoIcon}
                onPress={() => {
                  Alert.alert(
                    'Referral bonus',
                    'Referral bonus will be approved after successful sale of minimum Rs 100 within 60 days. Otherwise Your Bonus Validity Expired.',
                  );
                }}>
                <Image
                  style={styles.infoImage}
                  source={require('../../assets/icons/infoIcon.png')}
                />
              </Pressable>
              <View style={styles.currencyIcon}>
                <FontAwesome name="rupee" size={25} color="#0d4574" />
              </View>
              <View style={styles.currencyText}>
                <Text style={styles.currencyType}>Referal Bonus</Text>
                <Text style={styles.currencyAmount}>
                  <FontAwesome name="rupee" size={15} color="#fff" />{' '}
                  {uData.REFERALBONUS}
                </Text>
              </View>
            </View>
          </View>
        </View>

        <Text style={styles.annText}>Categories</Text>
        <FlatList
          data={categoryData}
          style={[styles.productContainer]}
          keyExtractor={item => item.categoryID}
          renderItem={({item}) => {
            return (
              <>
                {item.title != '' ? (
                  <Pressable
                    onPress={() => {
                      navigation.navigate('Accounts', {
                        title: item.title,
                        categoryID: item.categoryID,
                      });
                    }}
                    style={[styles.product]}>
                    <Image
                      source={{uri: item.image}}
                      style={styles.image}
                      resizeMode="contain"
                    />
                    <Text style={styles.title}>{item.title}</Text>
                    <Text style={styles.productNo}>
                      Product: {item.ProductCount}
                    </Text>
                    <View style={styles.productDescBox}>
                      <Text style={styles.productDesc}>{item.description}</Text>
                    </View>
                  </Pressable>
                ) : (
                  <Pressable
                    onPress={() => {
                      navigation.navigate('Products');
                    }}
                    style={[styles.product, styles.SeeMore]}>
                    <Text style={[styles.title, styles.seeMoreTitle]}>See</Text>
                    <Text style={[styles.title, styles.seeMoreTitle]}>
                      More
                    </Text>
                  </Pressable>
                )}
              </>
            );
          }}
          horizontal={false}
          numColumns={3}
        />

        <Text style={styles.annText}>New Products</Text>
        <FlatList
          data={NewProduct}
          style={[styles.pproductContainer]}
          keyExtractor={item => item.productId} //has to be unique
          renderItem={({item}) => {
            return (
              <Pressable
                onPress={() => {
                  navigation.navigate('Product', {
                    title: item.title,
                    productId: item.productId,
                  });
                }}
                style={[styles.pproduct]}>
                <Image
                  source={{uri: item.image}}
                  style={styles.pimage}
                  resizeMode="contain"
                />
              </Pressable>
            );
          }}
          horizontal={true}
          // numColumns={3}
        />

        <Text style={styles.annText}>Success Story</Text>
        <FlatList
          data={leader}
          style={[styles.leadercontainer]}
          keyExtractor={item => item.leaderId}
          renderItem={({item}) => {
            return (
              <View style={[styles.leaderdetails]}>
                <View style={[styles.leaderimageCon]}>
                  <Image
                    source={{uri: item.image}}
                    style={styles.leaderimage}
                    resizeMode="contain"
                  />
                  {/* <Image
          source={require('../../assets/Image/image2.png')} 
          style={styles.leaderimage}
          resizeMode="contain"
        /> */}
                </View>
                <View
                  style={{
                    flex: 5,
                    textAlign: 'center',
                    alignContent: 'center',
                    marginLeft: 26,
                    color: '#333',
                  }}>
                  <Text style={{fontSize: 17, marginBottom: 5, color: '#333'}}>
                    {item.name}
                  </Text>
                  <Text style={{fontSize: 12}}>{item.message}</Text>
                </View>
              </View>
            );
          }}
          horizontal={true}
          // numColumns={3}
        />

        <View style={styles.FooterContent}>
          <Text style={{fontSize: 14, textAlign: 'center', color: '#333'}}>
            Follow us on social media plateforms.
          </Text>
          <View style={styles.SocialList}>
            <Pressable
              onPress={() => {
                Linking.openURL(`https://www.jobipo.com/`);
              }}
              style={styles.SocialImage}>
              <FontAwesome name="facebook-f" size={15} color="#fff" />
            </Pressable>
            <Pressable
              onPress={() => {
                Linking.openURL(`https://www.jobipo.com/`);
              }}
              style={styles.SocialImage}>
              <FontAwesome name="instagram" size={15} color="#fff" />
            </Pressable>
            <Pressable
              onPress={() => {
                Linking.openURL(`https://www.jobipo.com/`);
              }}
              style={styles.SocialImage}>
              <FontAwesome name="twitter" size={15} color="#fff" />
            </Pressable>
            <Pressable
              onPress={() => {
                Linking.openURL(`https://www.jobipo.com/`);
              }}
              style={styles.SocialImage}>
              <FontAwesome name="youtube-play" size={15} color="#fff" />
            </Pressable>
            <Pressable
              onPress={() => {
                Linking.openURL(`https://www.jobipo.com/`);
              }}
              style={styles.SocialImage}>
              <FontAwesome name="linkedin" size={15} color="#fff" />
            </Pressable>
          </View>
          <Pressable
            onPress={() => {
              Linking.openURL(`https://www.jobipo.com/`);
            }}
            style={styles.TeligramLink}>
            <FontAwesome
              name="telegram"
              size={20}
              color="#fff"
              style={{marginHorizontal: 10}}
            />
            <Text style={{color: '#fff', textAlign: 'center'}}>
              {' '}
              Live update on Telegram
            </Text>
          </Pressable>
        </View>

        {/*  <View style={styles.annContainer}>
            <Text style={styles.annText}>Trainings</Text>
            <View style={styles.trainingSlider}>
              <View style={styles.trainingImage}>
                <Image source={require('../../assets/Image/training1.png')} />
              </View>
              <View style={styles.trainingBox}>
                <Text style={styles.trainingText}>
                  Jobipo Introduction
                </Text>
                <View style={styles.trainingDateContainer}>
                  <Text style={styles.trainingDate}>June 05, 2022</Text>
                  <View style={styles.trainingDateLine}></View>
                  <Text style={styles.trainingDate}>11:30AM- 12:30PM</Text>
                </View>
                <View style={styles.join}>
                  <Text style={styles.joinText}>Join Now</Text>
                </View>
              </View>
            </View>
          </View> */}
      </ScrollView>
      <Menu />
    </>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    paddingVertical: 13,
    paddingHorizontal: 31,
    backgroundColor: '#F8F8F8',
  },
  profile: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profContainer: {
    width: 82,
    height: 82,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 17,
  },
  h1: {
    fontSize: 20,
    // color: '#595959',
    color: '#333',
  },
  h2: {
    fontSize: 12,
    color: '#595959',
  },
  annContainer: {
    marginTop: 15,
  },
  annText: {
    backgroundColor: '#FFC895',
    fontSize: 20,
    color: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    fontWeight: '500',
    marginTop: 10,
    padding: 5,
  },
  annSlider: {
    marginTop: 12,
  },
  boxContainer: {
    marginTop: 3,
  },
  flexBoxes: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
  },
  box: {
    backgroundColor: '#0d4574',
    borderRadius: 7,
    paddingVertical: 12,
    paddingHorizontal: 15,
    width: '48%',
    flexDirection: 'row',
    // justifyContent: 'space-between',
    alignItems: 'center',
  },
  currencyIcon: {
    width: 36,
    height: 36,
    backgroundColor: '#fff',
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  currencyText: {
    textAlign: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
  },
  currencyType: {
    fontSize: 12,
    lineHeight: 23,
    color: '#fff',
  },
  currencyAmount: {
    fontSize: 16,
    lineHeight: 30,
    color: '#fff',
  },
  textone: {
    color: '#fff',
    fontSize: 10,
    lineHeight: 23,
  },
  infoIcon: {
    position: 'absolute',
    top: 5,
    right: 5,
  },
  infoImage: {
    width: 13,
    height: 13,
  },
  cardContainer: {
    flexDirection: 'row',
    marginTop: 21,
    justifyContent: 'space-between',
  },
  card: {
    // flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderRadius: 6,
    height: 70,
    width: '48%',
    borderColor: '#0d4574',
    borderWidth: 1,
  },
  cardIcon: {
    marginVertical: 10,
  },
  cardText: {
    color: '#333',
    fontSize: 14,
    marginBottom: 10,
  },
  cardImage: {
    backgroundColor: '#D0BAEA',
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 50,
    position: 'absolute',
    right: -15,
  },
  cardImage2: {
    backgroundColor: '#D0BAEA',
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 50,
    position: 'absolute',
    left: -15,
  },
  trainingSlider: {
    width: '100%',
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 13,
    paddingHorizontal: 20,
    marginTop: 12,
  },
  trainingImage: {
    backgroundColor: '#F8F3FD',
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 9,
    marginRight: 20,
  },
  trainingBox: {
    borderLeftWidth: 1.5,
    borderColor: '#D0BAEA',
    height: 96,
    paddingLeft: 20,
    paddingTop: 10,
  },
  trainingText: {
    color: '#595959',
    fontSize: 15,
  },
  trainingDateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  trainingDate: {
    color: '#595959',
    fontSize: 12,
  },
  trainingDateLine: {
    height: '70%',
    width: 1,
    backgroundColor: '#595959',
    marginHorizontal: 5,
  },
  join: {
    backgroundColor: '#EF8C8C',
    borderRadius: 8.5,
    width: 69,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 2,
    marginTop: 13,
  },
  joinText: {
    fontSize: 12,
  },
  productContainer: {
    marginVertical: 10,
    marginBottom: 10,
    width: '100%',
    paddingRight: 0,
    marginLeft: 0,
  },
  pproductContainer: {
    marginVertical: 10,
    marginBottom: 5,
    width: '100%',
    paddingRight: 0,
    marginLeft: 0,
    backgroundColor: '#ffff',
  },
  leadercontainer: {
    marginVertical: 10,
    marginBottom: 15,
    width: '100%',
    paddingRight: 0,
    marginLeft: 0,
  },
  FooterContent: {
    marginBottom: 100,
  },
  SocialList: {
    flexDirection: 'row',
    width: '60%',
    marginLeft: '22.5%',
    marginVertical: 13,
  },
  SocialImage: {
    flex: 1,
    backgroundColor: '#535353',
    marginLeft: 10,
    borderRadius: 20,
    padding: 8,
    textAlign: 'center',
    justifyContent: 'center',
  },
  TeligramLink: {
    flexDirection: 'row',
    backgroundColor: '#0d4574',
    marginTop: 5,
    width: '80%',
    marginLeft: '10%',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 50,
    textAlign: 'center',
    borderWidth: 1,
    borderColor: '#333',
  },
  SeeMore: {
    borderRadius: 90,
    textAlignVertical: 'center',
    justifyContent: 'center',
  },
  product: {
    backgroundColor: '#fff',
    width: '30%',
    margin: 4,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingTop: 10,
    paddingBottom: 5,
    paddingHorizontal: 1,
    borderRadius: 7,
  },
  pproduct: {
    backgroundColor: '#f8f8f8',
    width: 70,
    margin: 4,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingTop: 5,
    paddingBottom: 5,
    borderRadius: 50,
  },
  leaderdetails: {
    backgroundColor: '#fff',
    width: 300,
    margin: 4,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingTop: 5,
    paddingBottom: 5,
    borderRadius: 5,
    flexDirection: 'row',
  },
  image: {
    width: 40,
    height: 40,
  },
  pimage: {
    width: 50,
    height: 50,
  },
  leaderimageCon: {
    width: 50,
    maxWidth: 50,
    height: 50,
    flex: 2,
  },
  leaderimage: {
    width: 50,
    maxWidth: 50,
    height: 50,
    flex: 2,
    borderRadius: 50,
    borderColor: '#0d4574',
    borderWidth: 1,
    marginLeft: 10,
  },
  profimage: {
    width: 80,
    height: 80,
    borderRadius: 50,
    borderColor: '#0d4574',
    borderWidth: 1,
  },
  title: {
    color: '#595959',
    paddingTop: 2,
    fontSize: 10,
  },
  seeMoreTitle: {
    fontSize: 17,
    paddingTop: 0,
  },
  productNo: {
    color: '#595959',
    marginVertical: 0,
    fontSize: 12,
  },
  productDescBox: {
    backgroundColor: '#F8F3FD',
    width: '100%',
    paddingVertical: 2,
    borderRadius: 5,
  },
  productDesc: {
    textAlign: 'center',
    color: '#595959',
    backgroundColor: '#F8F8F8',
    fontSize: 8,
  },
});
